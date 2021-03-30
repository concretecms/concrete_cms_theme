<?php

namespace PortlandLabs\ConcreteCmsTheme\Navigation;

use League\Url\Url;

/**
 * Responsible for knowing about all the various parts of the ConcreteCMS web presence,
 * and linking to them. Uses .env to determine the proper URL to link to (so we can separate
 * dev, stage and prod environments)
 */

class UrlManager
{

    private $defaultUrls = [
        'MARKETING_COMMERCIAL' => 'https://www.concretecms.com',
        'MARKETING_OPENSOURCE' => 'https://www.concretecms.org',
        'MARKETPLACE' => 'https://marketplace.concretecms.com',
        'DOCUMENTATION' => 'https://documentation.concretecms.org',
        'TRAINING' => 'https://training.concretecms.com',
        'GIGS' => 'https://gigs.concretecms.com',
        'COMMUNITY' => 'https://community.concretecms.com',
        'FORUMS' => 'https://forums.concretecms.org',
        'TRANSLATE' => 'https://translate.concretecms.org',
    ];

    private $placeholders = [
        'marketing' => 'MARKETING_COMMERCIAL',
        'marketingorg' => 'MARKETING_OPENSOURCE',
        'marketplace' => 'MARKETPLACE',
        'documentation' => 'DOCUMENTATION',
        'training' => 'TRAINING',
        'gigs' => 'GIGS',
        'community' => 'COMMUNITY',
        'forums' => 'FORUMS',
        'translate' => 'TRANSLATE',
    ];
    
    protected function getEnvironmentUrl(string $site): string
    {
        $inspectVariable = strtoupper('URL_SITE_' . $site);
        $value = null;

        if (isset($_ENV[$inspectVariable])) {
            $value = $_ENV[$inspectVariable];
        }

        if ($value) {
            return $value;
        }

        return $this->defaultUrls[$site];
    }

    public function replacePlaceholderIfExists(string $url): string
    {
        foreach($this->placeholders as $placeholder => $type) {
            $url = str_replace('{{' . $placeholder . '}}', $this->getEnvironmentUrl($type), $url);
        }
        return $url;
    }

    /**
     * Returns the URL to the commercial marketing site.
     */
    public function getCommercialMarketingUrl(): string
    {
        return $this->getEnvironmentUrl('MARKETING_COMMERCIAL');
    }

}