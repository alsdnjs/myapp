import Parser from 'rss-parser';
import axios from 'axios';
import * as cheerio from 'cheerio';

const parser = new Parser();

export interface RssArticle {
  title: string;
  description: string;
  link: string;
  pubDate: string;
  source: string;
  imageUrl?: string;
}

// 카테고리별 RSS 피드 URL 매핑
const RSS_FEEDS = {
  IT: [
    'https://rss.donga.com/tech.xml',  // 동아일보 IT
    'https://rss.donga.com/digital.xml', // 동아일보 디지털
    'https://rss.donga.com/science.xml', // 동아일보 과학
    'https://www.zdnet.co.kr/news/rss/zdnet_news.xml', // ZDNet
    'https://www.itworld.co.kr/rss/news.xml', // ITWorld
    'https://www.ciokorea.com/rss/news.xml', // CIO Korea
  ],
  sports: [
    'https://rss.donga.com/sports.xml', // 동아일보 스포츠
  ],
  economy: [
    'https://rss.donga.com/economy.xml', // 동아일보 경제
  ],
};

// HTML 태그 제거 함수
const stripHtml = (html: string) => {
  return html.replace(/<[^>]*>/g, '');
};

// 기사 URL에서 이미지 URL 추출
const fetchArticleImage = async (url: string): Promise<string | undefined> => {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    
    // 1. og:image 메타 태그 확인
    const ogImage = $('meta[property="og:image"]').attr('content');
    if (ogImage) return ogImage;

    // 2. twitter:image 메타 태그 확인
    const twitterImage = $('meta[name="twitter:image"]').attr('content');
    if (twitterImage) return twitterImage;

    // 3. 첫 번째 이미지 태그 확인
    const firstImage = $('img').first().attr('src');
    if (firstImage) {
      // 상대 경로인 경우 절대 경로로 변환
      if (firstImage.startsWith('/')) {
        const urlObj = new URL(url);
        return `${urlObj.origin}${firstImage}`;
      }
      return firstImage;
    }

    return undefined;
  } catch (error) {
    console.error(`Error fetching image from ${url}:`, error);
    return undefined;
  }
};

// 이미지 URL 추출 함수 개선
const extractImageUrl = async (item: any): Promise<string | undefined> => {
  // 1. enclosure에서 이미지 찾기
  if (item.enclosure?.url && item.enclosure?.type?.startsWith('image/')) {
    return item.enclosure.url;
  }

  // 2. media:content에서 이미지 찾기
  if (item['media:content']?.['$']?.url) {
    return item['media:content']['$'].url;
  }

  // 3. content에서 이미지 찾기
  if (item.content) {
    const imgMatch = item.content.match(/<img[^>]+src="([^">]+)"/);
    if (imgMatch) return imgMatch[1];
  }

  // 4. description에서 이미지 찾기
  if (item.description) {
    const imgMatch = item.description.match(/<img[^>]+src="([^">]+)"/);
    if (imgMatch) return imgMatch[1];
  }

  // 5. 기사 URL에서 이미지 가져오기
  if (item.link) {
    const imageUrl = await fetchArticleImage(item.link);
    if (imageUrl) return imageUrl;
  }

  // 6. 기본 이미지 URL 반환 (카테고리별)
  const defaultImages = {
    IT: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop',
    sports: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=2070&auto=format&fit=crop',
    economy: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop'
  };

  return defaultImages[item.category as keyof typeof defaultImages];
};

export const fetchRssNews = async (category: 'IT' | 'sports' | 'economy'): Promise<RssArticle[]> => {
  try {
    console.log(`Fetching RSS news for category: ${category}`);
    
    const feedUrls = RSS_FEEDS[category];
    const allArticles: RssArticle[] = [];

    // 모든 피드 URL에서 데이터 가져오기
    for (const url of feedUrls) {
      try {
        console.log(`Attempting to fetch from: ${url}`);
        const feed = await parser.parseURL(url);
        console.log(`Successfully fetched feed from: ${url}, items count: ${feed.items.length}`);

        // 각 기사의 이미지를 병렬로 가져오기
        const articles = await Promise.all(
          feed.items.map(async (item) => {
            const imageUrl = await extractImageUrl({ ...item, category });
            return {
              title: stripHtml(item.title || ''),
              description: stripHtml(item.contentSnippet || item.content || ''),
              link: item.link || '',
              pubDate: item.pubDate || new Date().toISOString(),
              source: feed.title || 'Unknown Source',
              imageUrl,
            };
          })
        );

        allArticles.push(...articles);
      } catch (error) {
        console.error(`Error fetching feed from ${url}:`, error);
      }
    }

    console.log(`Total articles fetched: ${allArticles.length}`);

    // 최신순으로 정렬하고 6개만 반환
    return allArticles
      .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
      .slice(0, 6);

  } catch (error) {
    console.error('Error fetching RSS news:', error);
    throw new Error('Failed to fetch RSS news');
  }
}; 