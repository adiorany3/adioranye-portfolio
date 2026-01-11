import React from "react";

import { Heading, Flex, Text, Button, Avatar, RevealFx, Arrow, Column } from "@/once-ui/components";
import { Projects } from "@/components/work/Projects";

import { baseURL, routes } from "@/app/resources";
import { getContent } from "@/app/resources/content";
import { Mailchimp } from "@/components";
import { Posts } from "@/components/blog/Posts";
import { headers } from "next/headers";

export async function generateMetadata() {
  const headersList = headers();
  const cookie = headersList.get('cookie') || '';
  const locale = cookie.split(';').find(c => c.trim().startsWith('locale='))?.split('=')[1] || 'id';
  const content = getContent(locale);
  const title = content.home.title;
  const description = content.home.description;
  const ogImage = `https://${baseURL}/og?title=${encodeURIComponent(title)}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://${baseURL}`,
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

export default async function Home() {
  const headersList = headers();
  const cookie = headersList.get('cookie') || '';
  const locale = cookie.split(';').find(c => c.trim().startsWith('locale='))?.split('=')[1] || 'id';
  const content = getContent(locale);

  return (
    <Column maxWidth="m" gap="xl" horizontal="center">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: content.home.title,
            description: content.home.description,
            url: `https://${baseURL}`,
            image: `${baseURL}/og?title=${encodeURIComponent(content.home.title)}`,
            publisher: {
              "@type": "Person",
              name: content.person.name,
              image: {
                "@type": "ImageObject",
                url: `${baseURL}${content.person.avatar}`,
              },
            },
          }),
        }}
      />
      <Column fillWidth paddingY="l" gap="m">
        <Column maxWidth="s">
          <RevealFx translateY="4" fillWidth horizontal="start" paddingBottom="m">
            <Heading wrap="balance" variant="display-strong-l">
              {content.home.headline}
            </Heading>
          </RevealFx>
          <RevealFx translateY="8" delay={0.2} fillWidth horizontal="start" paddingBottom="m">
            <Text wrap="balance" onBackground="neutral-weak" variant="heading-default-xl">
              {content.home.subline}
            </Text>
          </RevealFx>
          <RevealFx translateY="12" delay={0.4} horizontal="start">
            <Button
              id="about"
              data-border="rounded"
              href="/about"
              variant="secondary"
              size="m"
              arrowIcon
            >
              <Flex gap="8" vertical="center">
                {content.about.avatar.display && (
                  <Avatar
                    style={{ marginLeft: "-0.75rem", marginRight: "0.25rem" }}
                    src={content.person.avatar}
                    size="m"
                  />
                )}
                {content.about.title}
              </Flex>
            </Button>
          </RevealFx>
        </Column>
      </Column>
      <RevealFx translateY="16" delay={0.6}>
        <Projects range={[1, 1]} />
      </RevealFx>
      {routes["/blog"] && (
        <Flex fillWidth gap="24" mobileDirection="column">
          <Flex flex={1} paddingLeft="l">
            <Heading as="h2" variant="display-strong-xs" wrap="balance">
              Latest from the blog
            </Heading>
          </Flex>
          <Flex flex={3} paddingX="20">
            <Posts range={[1, 2]} columns="2" />
          </Flex>
        </Flex>
      )}
      <Projects range={[2]} />
      {content.newsletter.display && <Mailchimp newsletter={content.newsletter} />}
    </Column>
  );
}
