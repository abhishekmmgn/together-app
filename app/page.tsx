import Image from "next/image";
import { Slider, Stack, Button } from "@mui/material";
import { VolumeDown, VolumeUp } from "@mui/icons-material";

export default function Home() {
  return (
    <main>
      <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
        <VolumeDown />
        <Slider aria-label="Volume" value={10} />
        <VolumeUp />
      </Stack>
      <Slider disabled defaultValue={30} aria-label="Disabled slider" />
      <Button variant="contained" sx={{width:'100%', height:'44px'}}>
        Hello World
      </Button>
      <Button variant="outlined" sx={{width:'100%', height:'44px'}}>
        Hello World
      </Button>
      <Button variant="text" sx={{width:'100%', height:'44px'}}>
        Hello World
      </Button>
    </main>
  );
}
