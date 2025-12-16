import { Helmet } from 'react-helmet-async';

const SEO = ({
    title = 'Khadamati - Home Services Platform',
    description = 'Find trusted home service providers in Baalbek-Hermel. Plumbing, electrical, cleaning, carpentry and more professional services.',
    keywords = 'home services, khadamati, plumbing, electrical, cleaning, carpentry, Baalbek, Hermel, Lebanon, service providers',
    author = 'Khadamati',
    type = 'website',
    image = '/logo.png'
}) => {
    return (
        <Helmet>
            {/* Primary Meta Tags */}
            <title>{title}</title>
            <meta name="title" content={title} />
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <meta name="author" content={author} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:title" content={title} />
            <meta property="twitter:description" content={description} />
            <meta property="twitter:image" content={image} />

            {/* Additional SEO */}
            <meta name="robots" content="index, follow" />
            <meta name="language" content="English, Arabic" />
            <meta name="revisit-after" content="7 days" />
            <link rel="canonical" href={window.location.href} />
        </Helmet>
    );
};

export default SEO;
