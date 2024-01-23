<?php

namespace PortlandLabs\ConcreteCmsTheme\Navigation;

use Concrete\Core\Application\ApplicationAwareInterface;
use Concrete\Core\Application\ApplicationAwareTrait;
use Concrete\Core\Entity\Site\Site;
use Concrete\Core\Page\Page;
use League\Url\Url;

/**
 * Responsible for knowing about all the various parts of the ConcreteCMS web presence,
 * and linking to them. Uses .env to determine the proper URL to link to (so we can separate
 * dev, stage and prod environments)
 */

class UrlManager implements ApplicationAwareInterface
{

    use ApplicationAwareTrait;

    private $defaultUrls = [
        'MARKETING_COMMERCIAL' => 'https://marketing.concretecms.com',
        'MARKETING_OPENSOURCE' => 'https://opensource.concretecms.org',
        'MARKETPLACE' => 'https://marketplace.concretecms.com',
        'DOCUMENTATION' => 'https://documentation.concretecms.org',
        'TRAINING' => 'https://training.concretecms.com',
        'GIGS' => 'https://gigs.concretecms.com',
        'COMMUNITY' => 'https://community.concretecms.com',
        'FORUMS' => 'https://forums.concretecms.org',
        'TRANSLATE' => 'https://translate.concretecms.org',
        'EXTENSIONS' => 'https://marketplace.concretecms.com',
    ];

    private $placeholders = [
        'marketing' => 'MARKETING_COMMERCIAL',
        'marketing_org' => 'MARKETING_OPENSOURCE',
        'marketplace' => 'MARKETPLACE',
        'documentation' => 'DOCUMENTATION',
        'training' => 'TRAINING',
        'gigs' => 'GIGS',
        'community' => 'COMMUNITY',
        'forums' => 'FORUMS',
        'extensions' => 'EXTENSIONS',
        'translate' => 'TRANSLATE',
    ];

    public function isSite(string $site): bool
    {
        $currentSite = $this->app->make('site')->getSite();
        $url = rtrim($this->getEnvironmentUrl($this->placeholders[$site]), '/');
        $siteCanonicalUrl = rtrim($currentSite->getSiteCanonicalUrl(), '/');
        if ($siteCanonicalUrl == $url) {
            return true;
        }
        return false;
    }

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

    /**
     * This magic method enables the following
     *     echo $urlManager->getMarketingUrl();
     *     echo $urlManager->getMarketingOrgUrl();
     *     echo $urlManager->getForumsUrl();
     *     echo $urlManager->getTrainingUrl();
     *     echo $urlManager->getTranslateUrl();
     * etc...
     */
    public function __call($method, $arguments)
    {
        $type = str_replace(['get_', '_url'], '', snake_case($method));
        return $this->getEnvironmentUrl($this->placeholders[$type]);
    }

    public function getSearchPageUrl(Site $site)
    {
        $config = $site->getConfigRepository();
        $marketingUrl = $this->getMarketingUrl();
        $searchPageId = (int)$config->get("concrete_cms_theme.search_page_id");
        $searchPageUrl = $marketingUrl . '/search';
        if ($searchPageId) {
            $searchPage = Page::getByID($searchPageId);
            if ($searchPage instanceof Page && !$searchPage->isError()) {
                $searchPageUrl = $searchPage->getCollectionLink();
            }
        }
        return $searchPageUrl;
    }

    public function replacePlaceholderIfExists(string $url): string
    {
        foreach($this->placeholders as $placeholder => $type) {
            $url = str_replace('{{' . $placeholder . '}}', $this->getEnvironmentUrl($type), $url);
        }
        return $url;
    }


}