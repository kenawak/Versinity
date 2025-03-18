import requests
from bs4 import BeautifulSoup
import json
import time
import random

# Test subset
bible_books = {
    "Gen": 2, # Genesis 1-2
    "Exodus": 2,   # Exodus 1-2
    "Judge": 2,   # Judges 1-2
    "1_Kings": 2    # 1 Kings 1-2
}

# Scrape commentaries directly from your IP
def scrape_commentary(book, chapter):
    # Try two possible URL formats
    urls = [
        f"https://ccel.org/study/{book}_{chapter}",  # Current format
        f"https://ccel.org/study/Judg_{chapter}" if book == "Judge" else f"https://ccel.org/study/{book}_{chapter}" , # Test full name for Judges
        f"https://ccel.org/study/1_Kgs_2"    
    ]
    headers = {"User-Agent": "BibleVerseApp/1.0 (contact: your-email@example.com)"}
    
    for url in urls:
        try:
            response = requests.get(url, timeout=30)
            response.raise_for_status()
            soup = BeautifulSoup(response.text, "html.parser")
            print(soup)
            # Find book-content div
            book_content = soup.select_one("div.book-content")
            if not book_content:
                print(f"No 'div.book-content' found for {book} {chapter} at {url}")
                continue
            
            # Debug: Print HTML
            print(f"HTML for {book} {chapter} at {url}:\n{book_content.prettify()[:500]}...")
            
            # Try Format 1: <p> with <b> verse numbers (Gen/Exod)
            commentary_data = {}
            p_tags = book_content.find_all("p")
            for p in p_tags:
                b_tag = p.find("b")
                if b_tag:
                    verse_num = b_tag.get_text(strip=True).rstrip(".")
                    i_tag = p.find("i")
                    commentary_text = p.get_text(strip=True)
                    if i_tag:
                        commentary_text = commentary_text.replace(b_tag.get_text(strip=True), "").replace(i_tag.get_text(strip=True), "").strip()
                    commentary_data[verse_num] = commentary_text
            
            # Try Format 2: <h3 class="s02"> for verse ranges (Judg snippet)
            if not commentary_data:
                h3_tags = book_content.find_all("h3", class_="s02")
                for h3 in h3_tags:
                    verse_range = h3.get_text(strip=True).replace("Verses ", "")
                    p_tag = h3.find_next("p")
                    if p_tag:
                        commentary_text = p_tag.get_text(strip=True)
                        commentary_data[verse_range] = commentary_text
            
            if not commentary_data:
                print(f"No commentary data extracted for {book} {chapter} at {url}")
                continue
            
            print(f"Scraped {book} {chapter} successfully from {url}: {commentary_data}")
            return commentary_data
        except (requests.RequestException, Exception) as e:
            print(f"Error on {url}: {e}")
    
    print(f"Failed to scrape {book} {chapter} from all URLs")
    return None

# Main scraping loop
commentaries = {}
for book, max_chapters in bible_books.items():
    print(f"Processing book: {book}")
    commentaries[book] = {}
    for chapter in range(1, max_chapters + 1):
        print(f"Scraping {book} {chapter}")
        data = scrape_commentary(book, chapter)
        if data:
            commentaries[book][str(chapter)] = data
        else:
            commentaries[book][str(chapter)] = {}
        time.sleep(random.uniform(1, 5))

# Save to JSON
with open("bible_commentaries_test.json", "w") as f:
    json.dump(commentaries, f, indent=2)

print("Scraping complete! Data saved to bible_commentaries_test.json")