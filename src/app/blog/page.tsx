import { Column, Flex, Heading, Text, Button, Card } from "@/once-ui/components";
import { Mailchimp } from "@/components";
import { baseURL } from "@/app/resources";
import { blog, person, newsletter } from "@/app/resources/content";
import Parser from 'rss-parser';

export const revalidate = 3600; // ISR setiap jam

export async function generateMetadata() {
  const title = blog.title;
  const description = blog.description;
  const ogImage = `https://${baseURL}/og?title=${encodeURIComponent(title)}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://${baseURL}/blog`,
      images: [
        {
          url: ogImage,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

async function getNews() {
  const parser = new Parser();
  try {
    const feed = await parser.parseURL('https://news.google.com/rss?hl=id&q=data+analytics');
    return feed.items.slice(0, 10);
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
}

export default async function Blog() {
  const news = await getNews();

  return (
    <Column maxWidth="s">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            headline: blog.title,
            description: blog.description,
            url: `https://${baseURL}/blog`,
            image: `${baseURL}/og?title=${encodeURIComponent(blog.title)}`,
            author: {
              "@type": "Person",
              name: person.name,
              image: {
                "@type": "ImageObject",
                url: `${baseURL}${person.avatar}`,
              },
            },
          }),
        }}
      />
      <Heading marginBottom="l" variant="display-strong-s">
        {blog.title}
      </Heading>
      <Column fillWidth flex={1} gap="l">
        {news.map((item, index) => (
          <Card key={index} padding="m" background="neutral-weak">
            <Flex direction="column" gap="s">
              <Heading as="h3" variant="heading-strong-m">
                {item.title}
              </Heading>
              <Text variant="body-default-s" color="neutral-weak">
                {item.pubDate ? new Date(item.pubDate).toLocaleDateString('id-ID') : 'Tanggal tidak tersedia'}
              </Text>
              <Text variant="body-default-m">
                {item.contentSnippet || item.summary || 'Deskripsi tidak tersedia'}
              </Text>
              <Button
                href={item.link}
                variant="secondary"
                size="s"
                target="_blank"
                rel="noopener noreferrer"
              >
                Baca Selengkapnya
              </Button>
            </Flex>
          </Card>
        ))}
      </Column>
      {newsletter.display && <Mailchimp newsletter={newsletter} />}
    </Column>
  );
}
