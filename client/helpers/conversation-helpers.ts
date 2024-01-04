export async function getConversation(conversationId: string) {
  try {
    const res = await fetch(`/api/conversation/${conversationId}`, {
      cache: "no-cache",
    });
    const data = await res.json();
    if (res.ok) {
      return data.data;
    }
  } catch (err) {
    console.log(err);
  }
}

export async function searchConversation(otherUserId: string) {
  try {
    const res = await fetch(`/api/conversation-by-user/${otherUserId}`, {
      cache: "no-cache",
    });
    if (res.ok) {
      const data = await res.json();
      return data.data;
    }
  } catch (err) {
    console.log(err);
  }
}

export async function createConversation(message: string, userId: string) {
  try {
    const res = await fetch(`/api/conversation-by-user/${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (err) {
    console.log(err);
  }
}

export async function sendMessage(message: string, conversationId: string) {
  try {
    const res = await fetch(`/api/conversation/${conversationId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (err) {
    console.log(err);
  }
}

export async function deleteConversation(
  conversationId: string,
  otherUserId: string
) {
  try {
    const res = await fetch(`/api/conversation/${conversationId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        otherUserId,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (err) {
    console.log(err);
  }
}
