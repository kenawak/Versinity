// This is a simplified implementation
// In production, you would use the Unsplash API with your API key
export async function fetchBackgroundImage(): Promise<string> {
    // Sample nature images for demonstration
    const sampleImages = [
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1080",
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1080",
      "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?auto=format&fit=crop&w=1080",
      "https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?auto=format&fit=crop&w=1080",
      "https://images.unsplash.com/photo-1431794062232-2a99a5431c6c?auto=format&fit=crop&w=1080",
      "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1080",
      "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=1080",
      "https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1080",
    ]
  
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300))
  
    // Return a random image
    const randomIndex = Math.floor(Math.random() * sampleImages.length)
    return sampleImages[randomIndex]
  }
  
  // For a real implementation, you would use the Unsplash API:
  /*
  export async function fetchBackgroundImage(): Promise<string> {
    const ACCESS_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY
    const response = await fetch(
      `https://api.unsplash.com/photos/random?query=peaceful+nature&orientation=portrait`,
      {
        headers: {
          Authorization: `Client-ID ${ACCESS_KEY}`,
        },
      }
    )
    
    const data = await response.json()
    return data.urls.regular
  }
  */
  
  