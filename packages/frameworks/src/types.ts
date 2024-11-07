/**
 * Framework detection information.
 */
export interface Framework {
  /**
   * Name of the framework
   * @example "Next.js"
   */
  name: string;
  /**
   * A unique identifier for the framework
   * @example "nextjs"
   */
  slug: string | null;
  /**
   * A URL to the logo of the framework
   */
  logo: string;
  /**
   * An additional URL to the logo of the framework optimized for dark mode
   */
  darkModeLogo?: string;
  /**
   * Short description of the framework
   * @example "A Next.js app and a Serverless Function API."
   */
  description: string;
  /**
   * A URL to the official website of the framework
   * @example "https://nextjs.org"
   */
  website?: string;
}
