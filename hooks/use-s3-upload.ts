import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useDropzone, type FileError, type FileRejection } from 'react-dropzone'

export interface FileWithPreview extends File {
  preview?: string
  errors: readonly FileError[]
}

type UseS3UploadOptions = {
  /**
   * Allowed MIME types for each file upload (e.g `image/png`, `video/mp4`). Wildcards supported (e.g `image/*`).
   * Defaults to allowing all MIME types.
   */
  allowedMimeTypes?: string[]
  /**
   * Maximum upload size in bytes. Defaults to unlimited.
   */
  maxFileSize?: number
  /**
   * Maximum number of files per upload. Defaults to 1.
   */
  maxFiles?: number
  /**
   * If true, upload starts automatically as soon as a valid file is dropped/selected.
   * Defaults to false (manual onUpload call required).
   */
  autoUpload?: boolean
  /**
   * Called whenever upload progress changes (0–100).
   */
  onProgress?: (percent: number) => void
  /**
   * Called when a file is successfully uploaded. Receives the public S3 URL.
   */
  onSuccess?: (url: string) => void
}

type UseS3UploadReturn = ReturnType<typeof useS3Upload>

const useS3Upload = (options: UseS3UploadOptions) => {
  const {
    allowedMimeTypes = [],
    maxFileSize = Number.POSITIVE_INFINITY,
    maxFiles = 1,
    autoUpload = false,
    onProgress,
    onSuccess,
  } = options

  const [files, setFiles] = useState<FileWithPreview[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [errors, setErrors] = useState<{ name: string; message: string }[]>([])
  const [successes, setSuccesses] = useState<string[]>([])
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([])
  const [uploadProgress, setUploadProgress] = useState<number>(0)

  // Track the S3 key of the most-recently uploaded file so it can be deleted on abandon/change
  const uploadedKeyRef = useRef<string | null>(null)

  const isSuccess = useMemo(() => {
    if (errors.length === 0 && successes.length === 0) return false
    if (errors.length === 0 && successes.length === files.filter(f => f.errors.length === 0).length && successes.length > 0) return true
    return false
  }, [errors.length, successes.length, files])

  /**
   * Delete an already-uploaded S3 object by its public URL.
   * Calls DELETE /api/upload-url with the S3 key extracted from the URL.
   */
  const deleteUploadedFile = useCallback(async (fileUrl: string) => {
    try {
      // Extract the key from the public URL: https://<bucket>.s3.<region>.amazonaws.com/<key>
      const url = new URL(fileUrl)
      const key = url.pathname.slice(1) // strip leading /
      await fetch('/api/upload-url', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key }),
      })
    } catch {
      // Silently ignore — delete is best-effort
    }
  }, [])

  /**
   * Upload a single file using XHR for progress tracking.
   */
  const uploadFileWithProgress = useCallback(
    (file: FileWithPreview): Promise<{ name: string; message?: string; fileUrl?: string; key?: string }> => {
      return new Promise(async (resolve) => {
        try {
          // 1. Get presigned URL
          const presignRes = await fetch('/api/upload-url', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contentType: file.type, fileName: file.name }),
          })

          if (!presignRes.ok) {
            const err = await presignRes.json()
            return resolve({ name: file.name, message: err.error ?? 'Failed to get upload URL' })
          }

          const { uploadUrl, fileUrl, key } = await presignRes.json()

          // 2. Upload to S3 via XHR for progress tracking
          const xhr = new XMLHttpRequest()
          xhr.open('PUT', uploadUrl)
          xhr.setRequestHeader('Content-Type', file.type)

          xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) {
              const pct = Math.round((e.loaded / e.total) * 100)
              setUploadProgress(pct)
              onProgress?.(pct)
            }
          }

          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              resolve({ name: file.name, fileUrl, key })
            } else {
              resolve({ name: file.name, message: 'Failed to upload file to S3' })
            }
          }

          xhr.onerror = () => resolve({ name: file.name, message: 'Network error during upload' })

          xhr.send(file)
        } catch (error: any) {
          resolve({ name: file.name, message: error.message ?? 'Upload failed' })
        }
      })
    },
    [onProgress]
  )

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      const validFiles = acceptedFiles
        .filter((file) => !files.find((x) => x.name === file.name))
        .map((file) => {
          ;(file as FileWithPreview).preview = URL.createObjectURL(file)
          ;(file as FileWithPreview).errors = []
          return file as FileWithPreview
        })

      const invalidFiles = fileRejections.map(({ file, errors }) => {
        ;(file as FileWithPreview).preview = URL.createObjectURL(file)
        ;(file as FileWithPreview).errors = errors
        return file as FileWithPreview
      })

      const newFiles = [...files, ...validFiles, ...invalidFiles]
      setFiles(newFiles)

      // Auto-upload valid files immediately if enabled
      if (autoUpload && validFiles.length > 0) {
        setLoading(true)
        setUploadProgress(0)
        setErrors([])
        setSuccesses([])
        setUploadedUrls([])

        Promise.all(validFiles.map(uploadFileWithProgress)).then((responses) => {
          const responseErrors = responses.filter((x) => x.message !== undefined)
          setErrors(responseErrors as { name: string; message: string }[])

          const responseSuccesses = responses.filter((x) => !x.message)
          setSuccesses(responseSuccesses.map((x) => x.name))

          const newUrls = responseSuccesses.map((x) => x.fileUrl!).filter(Boolean)
          setUploadedUrls(newUrls)

          // Track the latest uploaded key for deletion
          const latestKey = responseSuccesses[responseSuccesses.length - 1]?.key
          if (latestKey) uploadedKeyRef.current = latestKey

          // Fire onSuccess callbacks
          newUrls.forEach((url) => onSuccess?.(url))

          setLoading(false)
        })
      }
    },
    [files, autoUpload, uploadFileWithProgress, onSuccess]
  )

  const dropzoneProps = useDropzone({
    onDrop,
    noClick: true,
    accept: allowedMimeTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    maxSize: maxFileSize,
    maxFiles: maxFiles,
    multiple: maxFiles !== 1,
  })

  /** Manually trigger upload (for non-autoUpload mode) */
  const onUpload = useCallback(async () => {
    setLoading(true)
    setUploadProgress(0)

    const filesWithErrors = errors.map((x) => x.name)
    const filesToUpload =
      filesWithErrors.length > 0
        ? [
            ...files.filter((f) => filesWithErrors.includes(f.name)),
            ...files.filter((f) => !successes.includes(f.name)),
          ]
        : files.filter((f) => f.errors.length === 0)

    const responses = await Promise.all(filesToUpload.map(uploadFileWithProgress))

    const responseErrors = responses.filter((x) => x.message !== undefined)
    setErrors(responseErrors as { name: string; message: string }[])

    const responseSuccesses = responses.filter((x) => !x.message)
    const newSuccessNames = Array.from(new Set([...successes, ...responseSuccesses.map((x) => x.name)]))
    setSuccesses(newSuccessNames)

    const newUrls = responseSuccesses.map((x) => x.fileUrl!).filter(Boolean)
    setUploadedUrls((prev) => [...prev, ...newUrls])

    const latestKey = responseSuccesses[responseSuccesses.length - 1]?.key
    if (latestKey) uploadedKeyRef.current = latestKey

    newUrls.forEach((url) => onSuccess?.(url))

    setLoading(false)
  }, [files, errors, successes, uploadFileWithProgress, onSuccess])

  useEffect(() => {
    if (files.length === 0) {
      setErrors([])
      setUploadProgress(0)
    }

    if (files.length <= maxFiles) {
      let changed = false
      const newFiles = files.map((file) => {
        if (file.errors.some((e) => e.code === 'too-many-files')) {
          file.errors = file.errors.filter((e) => e.code !== 'too-many-files')
          changed = true
        }
        return file
      })
      if (changed) setFiles(newFiles)
    }
  }, [files.length, setFiles, maxFiles])

  return {
    files,
    setFiles,
    successes,
    isSuccess,
    loading,
    errors,
    setErrors,
    onUpload,
    uploadedUrls,
    uploadProgress,
    deleteUploadedFile,
    uploadedKeyRef,
    maxFileSize,
    maxFiles,
    allowedMimeTypes,
    ...dropzoneProps,
  }
}

export { useS3Upload, type UseS3UploadOptions, type UseS3UploadReturn }
