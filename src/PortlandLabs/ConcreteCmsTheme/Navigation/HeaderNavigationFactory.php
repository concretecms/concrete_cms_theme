<?php

namespace PortlandLabs\ConcreteCmsTheme\Navigation;

use Concrete\Core\Application\ApplicationAwareInterface;
use Concrete\Core\Application\ApplicationAwareTrait;
use Concrete\Core\Navigation\Item\Item;
use Concrete\Core\Navigation\Modifier\FlatChildrenModifier;
use Concrete\Core\Navigation\Navigation;
use Concrete\Core\Navigation\NavigationInterface;
use Concrete\Core\Navigation\NavigationModifier;
use PortlandLabs\ConcreteCmsTheme\Navigation\Modifier\SiteUrlPlaceholderModifier;

class HeaderNavigationFactory implements ApplicationAwareInterface, NavigationFactoryInterface
{

    use ApplicationAwareTrait;
    use NavigationFactoryTrait;

    const SECTION_SUPPORT = 'support';
    const SECTION_COMMUNITY = 'community';

    public function createNavigation(): NavigationInterface
    {
        $activeSection = $this->activeSection;
        // Determine if this navigation menu is for the concretecms.org site or not
        $enableDarkMode = \Core::make('site')->getSite()->getConfigRepository()->get("concrete_cms_theme.enable_dark_mode");

        $navigation = new Navigation();
        // About
        if ($enableDarkMode) {
            // About menu for sites with dark mode theme enabled
            $navigationAboutMenu = [
                new Item('{{marketing_org}}/vision', t('Vision')),
                new Item('{{marketing_org}}/security', t('Security')),
                new Item('{{marketing_org}}/about/blog/core-releases', t('Releases')),
                new Item('{{marketing_org}}/town-halls', t('Town Halls')),
                new Item('{{marketing_org}}/open-source-license ', t('License')),
                new Item('{{marketing_org}}/get-involved', t('Get Involved')),
                new Item('{{marketing_org}}/about/project-news', t('Project News')),
            ];
        } else {
            // About menu for sites with light mode theme enabled
            $navigationAboutMenu = [
                new Item('{{marketing}}/about/features', t('Features')),
                new Item('{{marketing}}/about/reviews', t('Reviews')),
                new Item('{{marketing}}/about/case-studies', t('Case Studies')),
                new Item('{{marketing}}/industries', t('Industries')),
                new Item('{{marketing}}/about/applications', t('Applications')),
                new Item('{{marketing}}/about/blog', t('Blog')),
                new Item('{{marketing}}/about/contact-us', t('Contact')),
            ];
        }
        $navigation->add(new Item('{{marketing}}/about', t('About'), false, false, $navigationAboutMenu));
        // Get Started
        $navigation->add(new Item('{{marketing}}/get-started', t('Get Started'), false, false, [
            new Item('{{marketing}}/hosting', t('Hosting')),
            new Item('{{marketing_org}}/download', t('Download')),
            new Item('{{documentation}}/developers/introduction/installing-concrete-cms', t('Installation')),
        ]));
        // Extensions
        $navigation->add(new Item('{{marketing}}/extensions', t('Extensions'), false, false, [
            new Item('{{marketplace}}/marketplace/addons', t('Add-ons')),
            new Item('{{marketplace}}/marketplace/themes', t('Themes')),
            new Item('{{marketing}}/extensions/related-projects', t('Related Projects')),
            new Item('{{marketing}}/extensions/translate', t('Translations')),
        ]));
        // Support
        $navigation->add(new Item('{{marketing}}/support', t('Support'), false, $activeSection === 'support', [
            new Item('{{marketing}}/support/hiring-help', t('Hiring Help')),
            new Item('{{documentation}}', t('Documentation')),
            new Item('{{forums}}', t('Forums')),
            new Item('{{marketing}}/support/training-certification', t('Training & Certification')),
        ]));
        // Community
        $navigation->add(new Item('{{marketing}}/community', t('Community'), false, $activeSection === 'community', [
            new Item('{{forums}}', t('Forums')),
            new Item('{{community}}/members/directory', t('Search Members')),
            new Item('{{marketing}}/extensions/translate', t('Translate')),
        ]));

        $modifier = new NavigationModifier();
        $modifier->addModifier($this->app->make(SiteUrlPlaceholderModifier::class));
        return $modifier->process($navigation);
    }
}
