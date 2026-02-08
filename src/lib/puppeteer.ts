import puppeteer, { type Browser } from "puppeteer";
import Handlebars from "handlebars";
import fs from "fs/promises";
import path from "path";

let browserInstance: Browser | null = null;

async function getBrowser(): Promise<Browser> {
  if (!browserInstance || !browserInstance.connected) {
    browserInstance = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
  }
  return browserInstance;
}

Handlebars.registerHelper("if", function (this: unknown, conditional: unknown, options: Handlebars.HelperOptions) {
  if (conditional) {
    return options.fn(this);
  }
  return options.inverse(this);
});

export async function renderTemplate(
  templateId: string,
  data: Record<string, unknown>,
  dimensions: { width: number; height: number }
): Promise<Buffer> {
  const templatePath = path.join(process.cwd(), "templates", `${templateId}.html`);
  const templateSource = await fs.readFile(templatePath, "utf-8");
  const template = Handlebars.compile(templateSource);

  const logoPath = path.join(process.cwd(), "public", "images", "logo.png");
  const logoExists = await fs.access(logoPath).then(() => true).catch(() => false);

  const html = template({
    ...data,
    logoUrl: logoExists
      ? `file://${logoPath}`
      : "",
  });

  const browser = await getBrowser();
  const page = await browser.newPage();

  try {
    await page.setViewport(dimensions);
    await page.setContent(html, { waitUntil: "networkidle0", timeout: 15000 });

    const screenshot = await page.screenshot({
      type: "jpeg",
      quality: 95,
    });

    return Buffer.from(screenshot);
  } finally {
    await page.close();
  }
}

export async function closeBrowser(): Promise<void> {
  if (browserInstance) {
    await browserInstance.close();
    browserInstance = null;
  }
}
