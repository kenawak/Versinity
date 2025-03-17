import type { Verse } from "@/types"

// This is a simplified implementation
// In production, you would use a real Bible API
export async function fetchRandomVerse(): Promise<Verse> {
  // Sample verses for demonstration
  const sampleVerses = [
    {
      id: "john-3-16",
      text: "For God so loved the world, that he gave his only Son, that whoever believes in him should not perish but have eternal life.",
      reference: "John 3:16",
      commentary:
        "This verse is often called 'the gospel in a nutshell' because it summarizes the entire Christian message. God's love is universal ('the world'), sacrificial ('gave his only Son'), and purposeful ('that whoever believes... should not perish but have eternal life').",
    },
    {
      id: "psalm-23-1",
      text: "The Lord is my shepherd; I shall not want.",
      reference: "Psalm 23:1",
      commentary:
        "This opening verse of the beloved Psalm 23 establishes a metaphor of God as a shepherd who provides complete care for His people. The phrase 'I shall not want' means 'I lack nothing' - expressing complete contentment and trust in God's provision.",
    },
    {
      id: "proverbs-3-5-6",
      text: "Trust in the Lord with all your heart, and do not lean on your own understanding. In all your ways acknowledge him, and he will make straight your paths.",
      reference: "Proverbs 3:5-6",
      commentary:
        "These verses emphasize complete trust in God rather than relying on human wisdom. The instruction to 'acknowledge him in all your ways' means to recognize God's presence and seek His guidance in every aspect of life, resulting in divine direction ('make straight your paths').",
    },
    {
      id: "philippians-4-13",
      text: "I can do all things through him who strengthens me.",
      reference: "Philippians 4:13",
      commentary:
        "Written by Paul while in prison, this verse speaks to finding strength in Christ during all circumstances. The 'all things' refers to whatever God has called us to do, not unlimited human ability. The context is about contentment in both abundance and need.",
    },
    {
      id: "romans-8-28",
      text: "And we know that for those who love God all things work together for good, for those who are called according to his purpose.",
      reference: "Romans 8:28",
      commentary:
        "This verse offers profound comfort by assuring believers that God orchestrates all circumstances—both pleasant and painful—toward a good purpose in the lives of those who love Him. The 'good' promised is ultimately conformity to Christ's image (as explained in the following verse).",
    },
    {
      id: "jeremiah-29-11",
      text: "For I know the plans I have for you, declares the Lord, plans for welfare and not for evil, to give you a future and a hope.",
      reference: "Jeremiah 29:11",
      commentary:
        "Spoken to the Israelites in Babylonian exile, this verse reminds us that God's plans transcend our immediate circumstances. While originally addressed to Israel as a nation, it reveals God's character as one who works with purpose and benevolence toward His people even in difficult times.",
    },
    {
      id: "matthew-11-28",
      text: "Come to me, all who labor and are heavy laden, and I will give you rest.",
      reference: "Matthew 11:28",
      commentary:
        "Jesus offers spiritual rest to those burdened by religious legalism and the weight of sin. The 'rest' promised is not merely physical relaxation but peace with God. This invitation is universal ('all who labor') and the promise is personal ('I will give you rest').",
    },
    {
      id: "isaiah-40-31",
      text: "But they who wait for the Lord shall renew their strength; they shall mount up with wings like eagles; they shall run and not be weary; they shall walk and not faint.",
      reference: "Isaiah 40:31",
      commentary:
        "This verse promises renewed strength to those who 'wait for the Lord'—meaning those who hope in, expect, and look for God's intervention. The imagery of soaring eagles, running without weariness, and walking without fainting illustrates the supernatural endurance God provides to those who rely on Him.",
    },
  ]

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Return a random verse
  const randomIndex = Math.floor(Math.random() * sampleVerses.length)
  return {
    ...sampleVerses[randomIndex],
    imageUrl: "", // Will be filled by the unsplash API
  }
}

// For a real implementation, you would use the ESV API or similar:
/*
export async function fetchRandomVerse(): Promise<Verse> {
  const API_KEY = process.env.NEXT_PUBLIC_ESV_API_KEY
  const response = await fetch(
    `https://api.esv.org/v3/passage/text/?q=random&include-passage-references=true&include-verse-numbers=false`,
    {
      headers: {
        Authorization: `Token ${API_KEY}`,
      },
    }
  )
  
  const data = await response.json()
  
  return {
    id: data.query,
    text: data.passages[0].trim(),
    reference: data.query,
    imageUrl: "",
    commentary: "Commentary would be fetched from a separate API or database."
  }
}
*/

export const sampleVerses = [
  {
    id: "john-3-16",
    text: "For God so loved the world, that he gave his only Son, that whoever believes in him should not perish but have eternal life.",
    reference: "John 3:16",
    commentary:
      "This verse is often called 'the gospel in a nutshell' because it summarizes the entire Christian message. God's love is universal ('the world'), sacrificial ('gave his only Son'), and purposeful ('that whoever believes... should not perish but have eternal life').",
  },
  {
    id: "psalm-23-1",
    text: "The Lord is my shepherd; I shall not want.",
    reference: "Psalm 23:1",
    commentary:
      "This opening verse of the beloved Psalm 23 establishes a metaphor of God as a shepherd who provides complete care for His people. The phrase 'I shall not want' means 'I lack nothing' - expressing complete contentment and trust in God's provision.",
  },
  {
    id: "proverbs-3-5-6",
    text: "Trust in the Lord with all your heart, and do not lean on your own understanding. In all your ways acknowledge him, and he will make straight your paths.",
    reference: "Proverbs 3:5-6",
    commentary:
      "These verses emphasize complete trust in God rather than relying on human wisdom. The instruction to 'acknowledge him in all your ways' means to recognize God's presence and seek His guidance in every aspect of life, resulting in divine direction ('make straight your paths').",
  },
  {
    id: "philippians-4-13",
    text: "I can do all things through him who strengthens me.",
    reference: "Philippians 4:13",
    commentary:
      "Written by Paul while in prison, this verse speaks to finding strength in Christ during all circumstances. The 'all things' refers to whatever God has called us to do, not unlimited human ability. The context is about contentment in both abundance and need.",
  },
  {
    id: "romans-8-28",
    text: "And we know that for those who love God all things work together for good, for those who are called according to his purpose.",
    reference: "Romans 8:28",
    commentary:
      "This verse offers profound comfort by assuring believers that God orchestrates all circumstances—both pleasant and painful—toward a good purpose in the lives of those who love Him. The 'good' promised is ultimately conformity to Christ's image (as explained in the following verse).",
  },
  {
    id: "jeremiah-29-11",
    text: "For I know the plans I have for you, declares the Lord, plans for welfare and not for evil, to give you a future and a hope.",
    reference: "Jeremiah 29:11",
    commentary:
      "Spoken to the Israelites in Babylonian exile, this verse reminds us that God's plans transcend our immediate circumstances. While originally addressed to Israel as a nation, it reveals God's character as one who works with purpose and benevolence toward His people even in difficult times.",
  },
  {
    id: "matthew-11-28",
    text: "Come to me, all who labor and are heavy laden, and I will give you rest.",
    reference: "Matthew 11:28",
    commentary:
      "Jesus offers spiritual rest to those burdened by religious legalism and the weight of sin. The 'rest' promised is not merely physical relaxation but peace with God. This invitation is universal ('all who labor') and the promise is personal ('I will give you rest').",
  },
  {
    id: "isaiah-40-31",
    text: "But they who wait for the Lord shall renew their strength; they shall mount up with wings like eagles; they shall run and not be weary; they shall walk and not faint.",
    reference: "Isaiah 40:31",
    commentary:
      "This verse promises renewed strength to those who 'wait for the Lord'—meaning those who hope in, expect, and look for God's intervention. The imagery of soaring eagles, running without weariness, and walking without fainting illustrates the supernatural endurance God provides to those who rely on Him.",
  },
]

