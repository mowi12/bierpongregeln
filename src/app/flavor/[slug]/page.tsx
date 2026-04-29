import Link from "next/link";
import { notFound } from "next/navigation";
import {
    type Article,
    isSection,
    type Paragraph,
    type Ruleset,
    type Section,
} from "@/components/types/ruleset.types";
import { getMergedRuleset, getRulesetSlugs } from "@/lib/ruleset-loader";

// --- Helper Functions & Components ---

/**
 * Creates a map of Article ID to its dynamically calculated number and title.
 * This is used for resolving [[ref:id]] links into human-readable text.
 */
const createReferenceMap = (ruleset: Ruleset) => {
    const refMap = new Map<string, { number: number; title: string }>();
    let articleCounter = 1;

    const traverse = (items: (Section | Article)[]) => {
        for (const item of items) {
            if ("content" in item) {
                // It's a Section
                traverse(item.content);
            } else {
                // It's an Article
                refMap.set(item.id, {
                    number: articleCounter,
                    title: item.title,
                });
                articleCounter++;
            }
        }
    };

    traverse(ruleset.sections);
    return refMap;
};

/**
 * Renders the content of a paragraph, parsing out any [[ref:id]] links
 * and converting them into clickable <Link> components.
 */
const ParagraphRenderer = ({
    content,
    refMap,
}: {
    content: string;
    refMap: Map<string, { number: number; title: string }>;
}) => {
    const parts = content.split(/(\[\[ref:.*?\]\])/g);

    const renderedParts = parts.map((part, index) => {
        const match = part.match(/\[\[ref:(.*?)\]\]/);
        if (match) {
            const refId = match[1];
            const key = `ref-${refId}-${index}`;
            const refData = refMap.get(refId);
            if (refData) {
                return (
                    <Link
                        key={key}
                        href={`#${refId}`}
                        className="font-medium text-blue-600 hover:underline dark:text-blue-400"
                    >
                        Art. {refData.number}
                    </Link>
                );
            }
            return (
                <span key={key} className="text-red-500">
                    [Invalid Ref: {refId}]
                </span>
            );
        }
        // biome-ignore lint: lint/security/noDangerouslySetInnerHtml
        return <span key={index} dangerouslySetInnerHTML={{ __html: part }} />;
    });

    return <>{renderedParts}</>;
};

/**
 * Renders a single Article.
 */
const ArticleComponent = ({
    article,
    number,
    refMap,
}: {
    article: Article;
    number: number;
    refMap: Map<string, { number: number; title: string }>;
}) => (
    <div id={article.id} className="mb-8 scroll-mt-20">
        <h3 className="mb-3 text-xl font-semibold text-gray-800 dark:text-gray-200">
            Art. {number} - {article.title}
        </h3>
        <div className="space-y-2 text-gray-700 dark:text-gray-300">
            {article.paragraphs.map((p, i) => (
                <div key={p.id} className="flex items-start">
                    <span className="w-8 flex-shrink-0 font-mono text-gray-500">({i + 1})</span>
                    <p className="flex-1">
                        <ParagraphRenderer content={p.content} refMap={refMap} />
                    </p>
                </div>
            ))}
        </div>
    </div>
);

/**
 * Renders a Section, which can contain other Sections or Articles recursively.
 */
const SectionComponent = ({
    section,
    articleCounter,
    refMap,
}: {
    section: Section;
    articleCounter: { current: number };
    refMap: Map<string, { number: number; title: string }>;
}) => {
    if (section.content.length === 0) {
        return null;
    }

    return (
        <section id={section.id} className="mb-12 scroll-mt-20">
            <h2 className="mb-6 border-b border-gray-200 pb-3 text-3xl font-bold text-gray-900 dark:border-gray-700 dark:text-gray-100">
                {section.title}
            </h2>
            {section.content.map((item) => {
                if (isSection(item)) {
                    // is Section
                    return (
                        <SectionComponent
                            key={item.id}
                            section={item}
                            articleCounter={articleCounter}
                            refMap={refMap}
                        />
                    );
                } else {
                    // is Article
                    articleCounter.current++;
                    return (
                        <ArticleComponent
                            key={item.id}
                            article={item}
                            number={articleCounter.current}
                            refMap={refMap}
                        />
                    );
                }
            })}
        </section>
    );
};

// --- The Page Component ---

export async function generateStaticParams() {
    const slugs = await getRulesetSlugs();
    return slugs.map((slug: string) => ({ slug }));
}

type FlavorPageProps = {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function FlavorPage({ params }: FlavorPageProps) {
    const { slug } = await params;
    const ruleset = await getMergedRuleset(slug);

    if (!ruleset) {
        notFound();
    }

    const refMap = createReferenceMap(ruleset);
    const articleCounter = { current: 0 };

    // For propper rendering, add an ID to the paragraphs of each article
    const allParagraphs: Paragraph[] = [];
    ruleset.sections.forEach((section) => {
        const paragraphs = getParagraphs(section);
        allParagraphs.push(...paragraphs);
    });
    allParagraphs.forEach((p, i) => {
        p.id = `paragraph-${i + 1}`;
    });

    return (
        <div className="py-12">
            <h1 className="mb-4 text-5xl font-extrabold text-gray-900 dark:text-gray-100">
                {ruleset.name}
            </h1>
            <hr className="mb-12 border-gray-200 dark:border-gray-700" />
            {ruleset.sections.map((section) => (
                <SectionComponent
                    key={section.id}
                    section={section}
                    articleCounter={articleCounter}
                    refMap={refMap}
                />
            ))}
        </div>
    );
}

function getParagraphs(section: Section) {
    const paragraphs: Paragraph[] = [];
    section.content.forEach((item) => {
        if (isSection(item)) {
            paragraphs.push(...getParagraphs(item));
        } else {
            paragraphs.push(...item.paragraphs);
        }
    });
    return paragraphs;
}
