import { NextResponse } from 'next/server';
import { fetchRssNews } from '@/utils/rssApi';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') as 'IT' | 'sports' | 'economy';

    if (!category) {
      return NextResponse.json(
        { error: 'Category parameter is required' },
        { status: 400 }
      );
    }

    console.log(`Fetching news for category: ${category}`);
    const articles = await fetchRssNews(category);
    
    console.log(`Successfully fetched ${articles.length} articles`);
    return NextResponse.json(articles);

  } catch (error) {
    console.error('Error in news API route:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
} 