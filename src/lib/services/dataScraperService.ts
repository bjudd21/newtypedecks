/**
 * Data Scraper Service
 *
 * Handles web scraping from gundam-gcg.com and other official card game sources
 * with rate limiting, retry logic, and error handling.
 */

export interface ScraperConfig {
  baseUrl: string;
  apiKey?: string;
  rateLimitMs: number;
  maxRetries: number;
  timeout?: number;
  userAgent?: string;
}

export interface DataSource {
  url: string;
  type: 'card' | 'set' | 'listing';
  metadata: {
    setId?: string;
    cardType?: string;
    priority: number;
  };
}

export interface RawCardData {
  name: string;
  imageUrl?: string;
  setInfo?: {
    name: string;
    code: string;
    number: string;
  };
  attributes?: Record<string, unknown>;
  text?: {
    description?: string;
    officialText?: string;
    abilities?: string;
  };
  stats?: {
    level?: number;
    cost?: number;
    clashPoints?: number;
    hitPoints?: number;
    attackPoints?: number;
    price?: number;
  };
  categories?: {
    faction?: string;
    pilot?: string;
    model?: string;
    series?: string;
    nation?: string;
    keywords?: string[];
    tags?: string[];
  };
  flags?: {
    isFoil?: boolean;
    isPromo?: boolean;
    isAlternate?: boolean;
  };
  metadata?: {
    sourceUrl: string;
    scrapedAt: Date;
    language?: string;
  };
}

export class DataScraperService {
  private config: ScraperConfig;
  private lastRequestTime = 0;

  constructor(config: ScraperConfig) {
    this.config = {
      timeout: 30000,
      userAgent: 'Gundam-Card-Game-DB-Bot/1.0 (Educational/Non-commercial)',
      ...config,
    };
  }

  /**
   * Test connection to the data source
   */
  public async testConnection(): Promise<boolean> {
    try {
      const response = await this.makeRequest(this.config.baseUrl, {
        method: 'HEAD',
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * Discover available card data sources
   */
  public async discoverCardSources(options?: {
    setIds?: string[];
    cardTypes?: string[];
  }): Promise<DataSource[]> {
    const dataSources: DataSource[] = [];

    try {
      // Discover card sets
      const sets = await this.discoverCardSets(options?.setIds);
      dataSources.push(...sets);

      // Discover individual cards
      const cards = await this.discoverIndividualCards(options?.cardTypes);
      dataSources.push(...cards);

      // Sort by priority (sets first, then cards)
      return dataSources.sort((a, b) => b.metadata.priority - a.metadata.priority);

    } catch (error) {
      console.error('Error discovering card sources:', error);
      return dataSources;
    }
  }

  /**
   * Scrape card data from a specific URL
   */
  public async scrapeCardData(url: string): Promise<RawCardData | null> {
    await this.enforceRateLimit();

    try {
      const response = await this.makeRequest(url);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const html = await response.text();
      return await this.parseCardData(html, url);

    } catch (error) {
      console.error(`Error scraping card data from ${url}:`, error);
      throw error;
    }
  }

  /**
   * Parse HTML content to extract card data
   */
  private async parseCardData(html: string, sourceUrl: string): Promise<RawCardData | null> {
    try {
      // This is a simplified parser - in reality, you'd use a proper HTML parser like cheerio
      const cardData: RawCardData = {
        name: '',
        metadata: {
          sourceUrl,
          scrapedAt: new Date(),
        },
      };

      // Parse card name
      const nameMatch = html.match(/<h1[^>]*class="[^"]*card-name[^"]*"[^>]*>([^<]+)<\/h1>/i);
      if (nameMatch) {
        cardData.name = this.cleanText(nameMatch[1]);
      }

      // Parse image URL
      const imageMatch = html.match(/<img[^>]*class="[^"]*card-image[^"]*"[^>]*src="([^"]+)"/i);
      if (imageMatch) {
        cardData.imageUrl = this.resolveUrl(imageMatch[1]);
      }

      // Parse set information
      cardData.setInfo = this.parseSetInfo(html);

      // Parse card attributes and stats
      cardData.stats = this.parseCardStats(html);
      cardData.categories = this.parseCardCategories(html);
      cardData.text = this.parseCardText(html);
      cardData.flags = this.parseCardFlags(html);

      // Only return data if we have a valid card name
      return cardData.name ? cardData : null;

    } catch (error) {
      console.error(`Error parsing card data from ${sourceUrl}:`, error);
      return null;
    }
  }

  /**
   * Parse set information from HTML
   */
  private parseSetInfo(html: string): RawCardData['setInfo'] {
    const setInfo: Partial<{ name: string; code: string; number: string }> = {};

    // Parse set name
    const setNameMatch = html.match(/<span[^>]*class="[^"]*set-name[^"]*"[^>]*>([^<]+)<\/span>/i);
    if (setNameMatch) {
      setInfo.name = this.cleanText(setNameMatch[1]);
    }

    // Parse set code
    const setCodeMatch = html.match(/<span[^>]*class="[^"]*set-code[^"]*"[^>]*>([^<]+)<\/span>/i);
    if (setCodeMatch) {
      setInfo.code = this.cleanText(setCodeMatch[1]);
    }

    // Parse card number
    const numberMatch = html.match(/<span[^>]*class="[^"]*card-number[^"]*"[^>]*>([^<]+)<\/span>/i);
    if (numberMatch) {
      setInfo.number = this.cleanText(numberMatch[1]);
    }

    return Object.keys(setInfo).length > 0 ? setInfo as { name: string; code: string; number: string } : undefined;
  }

  /**
   * Parse card statistics from HTML
   */
  private parseCardStats(html: string): RawCardData['stats'] {
    const stats: RawCardData['stats'] = {};

    // Parse level
    const levelMatch = html.match(/<span[^>]*class="[^"]*level[^"]*"[^>]*>(\d+)<\/span>/i);
    if (levelMatch) {
      stats.level = parseInt(levelMatch[1], 10);
    }

    // Parse cost
    const costMatch = html.match(/<span[^>]*class="[^"]*cost[^"]*"[^>]*>(\d+)<\/span>/i);
    if (costMatch) {
      stats.cost = parseInt(costMatch[1], 10);
    }

    // Parse clash points
    const cpMatch = html.match(/<span[^>]*class="[^"]*clash-points[^"]*"[^>]*>(\d+)<\/span>/i);
    if (cpMatch) {
      stats.clashPoints = parseInt(cpMatch[1], 10);
    }

    // Parse hit points
    const hpMatch = html.match(/<span[^>]*class="[^"]*hit-points[^"]*"[^>]*>(\d+)<\/span>/i);
    if (hpMatch) {
      stats.hitPoints = parseInt(hpMatch[1], 10);
    }

    return Object.keys(stats).length > 0 ? stats : undefined;
  }

  /**
   * Parse card categories from HTML
   */
  private parseCardCategories(html: string): RawCardData['categories'] {
    const categories: RawCardData['categories'] = {};

    // Parse faction
    const factionMatch = html.match(/<span[^>]*class="[^"]*faction[^"]*"[^>]*>([^<]+)<\/span>/i);
    if (factionMatch) {
      categories.faction = this.cleanText(factionMatch[1]);
    }

    // Parse pilot
    const pilotMatch = html.match(/<span[^>]*class="[^"]*pilot[^"]*"[^>]*>([^<]+)<\/span>/i);
    if (pilotMatch) {
      categories.pilot = this.cleanText(pilotMatch[1]);
    }

    // Parse keywords
    const keywordMatches = html.match(/<div[^>]*class="[^"]*keywords[^"]*"[^>]*>([\s\S]*?)<\/div>/i);
    if (keywordMatches) {
      const keywordTags = keywordMatches[1].match(/<span[^>]*>([^<]+)<\/span>/g);
      if (keywordTags) {
        categories.keywords = keywordTags.map(tag =>
          this.cleanText(tag.replace(/<[^>]+>/g, ''))
        ).filter(Boolean);
      }
    }

    return Object.keys(categories).length > 0 ? categories : undefined;
  }

  /**
   * Parse card text content from HTML
   */
  private parseCardText(html: string): RawCardData['text'] {
    const text: RawCardData['text'] = {};

    // Parse description
    const descMatch = html.match(/<div[^>]*class="[^"]*description[^"]*"[^>]*>([\s\S]*?)<\/div>/i);
    if (descMatch) {
      text.description = this.cleanText(descMatch[1].replace(/<[^>]+>/g, ''));
    }

    // Parse official text
    const officialMatch = html.match(/<div[^>]*class="[^"]*official-text[^"]*"[^>]*>([\s\S]*?)<\/div>/i);
    if (officialMatch) {
      text.officialText = this.cleanText(officialMatch[1].replace(/<[^>]+>/g, ''));
    }

    return Object.keys(text).length > 0 ? text : undefined;
  }

  /**
   * Parse card flags from HTML
   */
  private parseCardFlags(html: string): RawCardData['flags'] {
    const flags: RawCardData['flags'] = {};

    if (html.includes('foil') || html.includes('holo')) {
      flags.isFoil = true;
    }

    if (html.includes('promo') || html.includes('promotional')) {
      flags.isPromo = true;
    }

    if (html.includes('alternate') || html.includes('alt-art')) {
      flags.isAlternate = true;
    }

    return Object.keys(flags).length > 0 ? flags : undefined;
  }

  /**
   * Discover card sets from the source
   */
  private async discoverCardSets(setIds?: string[]): Promise<DataSource[]> {
    const dataSources: DataSource[] = [];

    try {
      // Mock implementation - in reality, you'd scrape the sets listing page
      const setsListUrl = `${this.config.baseUrl}/sets`;
      const response = await this.makeRequest(setsListUrl);

      if (response.ok) {
        const html = await response.text();

        // Parse set links from HTML
        const setLinkRegex = /<a[^>]*href="([^"]*\/sets\/[^"]+)"[^>]*>([^<]+)<\/a>/gi;
        let match;

        while ((match = setLinkRegex.exec(html)) !== null) {
          const [, href, _setName] = match;
          const setId = this.extractSetIdFromUrl(href);

          // Filter by requested set IDs if provided
          if (setIds && setIds.length > 0 && !setIds.includes(setId)) {
            continue;
          }

          dataSources.push({
            url: this.resolveUrl(href),
            type: 'set',
            metadata: {
              setId,
              priority: 100, // Sets have high priority
            },
          });
        }
      }

    } catch (error) {
      console.error('Error discovering card sets:', error);
    }

    return dataSources;
  }

  /**
   * Discover individual cards from the source
   */
  private async discoverIndividualCards(cardTypes?: string[]): Promise<DataSource[]> {
    const dataSources: DataSource[] = [];

    try {
      // Mock implementation - in reality, you'd scrape card listing pages
      const cardsListUrl = `${this.config.baseUrl}/cards`;
      const response = await this.makeRequest(cardsListUrl);

      if (response.ok) {
        const html = await response.text();

        // Parse card links from HTML
        const cardLinkRegex = /<a[^>]*href="([^"]*\/cards\/[^"]+)"[^>]*>([^<]+)<\/a>/gi;
        let match;

        while ((match = cardLinkRegex.exec(html)) !== null) {
          const [, href, _cardName] = match;
          const cardType = this.extractCardTypeFromUrl(href);

          // Filter by requested card types if provided
          if (cardTypes && cardTypes.length > 0 && !cardTypes.includes(cardType)) {
            continue;
          }

          dataSources.push({
            url: this.resolveUrl(href),
            type: 'card',
            metadata: {
              cardType,
              priority: 50, // Individual cards have lower priority than sets
            },
          });
        }
      }

    } catch (error) {
      console.error('Error discovering individual cards:', error);
    }

    return dataSources;
  }

  /**
   * Make HTTP request with retry logic
   */
  private async makeRequest(url: string, options?: RequestInit): Promise<Response> {
    const requestOptions: RequestInit = {
      headers: {
        'User-Agent': this.config.userAgent!,
        ...(this.config.apiKey && { 'Authorization': `Bearer ${this.config.apiKey}` }),
        ...options?.headers,
      },
      ...options,
    };

    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= this.config.maxRetries; attempt++) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), this.config.timeout);

        const response = await fetch(url, {
          ...requestOptions,
          signal: controller.signal,
        });

        clearTimeout(timeout);
        return response;

      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');

        if (attempt < this.config.maxRetries) {
          // Exponential backoff
          const delay = Math.pow(2, attempt) * 1000;
          await this.sleep(delay);
        }
      }
    }

    throw lastError || new Error('Request failed after maximum retries');
  }

  /**
   * Enforce rate limiting between requests
   */
  private async enforceRateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;

    if (timeSinceLastRequest < this.config.rateLimitMs) {
      const waitTime = this.config.rateLimitMs - timeSinceLastRequest;
      await this.sleep(waitTime);
    }

    this.lastRequestTime = Date.now();
  }

  /**
   * Sleep utility
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Clean and normalize text content
   */
  private cleanText(text: string): string {
    return text
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Resolve relative URLs to absolute URLs
   */
  private resolveUrl(url: string): string {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }

    const baseUrl = this.config.baseUrl.replace(/\/+$/, '');
    const path = url.startsWith('/') ? url : `/${url}`;
    return `${baseUrl}${path}`;
  }

  /**
   * Extract set ID from URL
   */
  private extractSetIdFromUrl(url: string): string {
    const match = url.match(/\/sets\/([^\/\?]+)/);
    return match ? match[1] : '';
  }

  /**
   * Extract card type from URL
   */
  private extractCardTypeFromUrl(url: string): string {
    const match = url.match(/\/cards\/[^\/]*\/([^\/\?]+)/);
    return match ? match[1] : '';
  }
}