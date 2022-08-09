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
    const SECTION_EXTENSIONS = 'extensions';

    public function createNavigation(): NavigationInterface
    {
        $activeSection = $this->activeSection;

        $navigation = new Navigation();
        $navigation->add(new Item('{{marketing}}/about', t('About'), false, false, [
            new Item('{{marketing}}/about/features', t('Features')),
            new Item('{{marketing}}/about/case-studies', t('Case Studies')),
            new Item('{{marketing}}/about/solutions', t('Solutions')),
            new Item('{{marketing}}/about/blog', t('Blog')),
            new Item('{{marketing}}/about/contact-us', t('Contact')),
        ]));
        $navigation->add(new Item('{{marketing}}/get-started', t('Get Started'), false, false, [
            new Item('{{marketing}}/about/solutions', t('Solutions')),
            new Item('{{marketing}}/hosting', t('Hosting')),
            new Item('{{marketing_org}}/download', t('Download')),
            new Item('{{documentation}}/developers/introduction/installation', t('Installation')),
        ]));
        $navigation->add(new Item('{{marketing}}/extensions', t('Extensions'), $activeSection === self::SECTION_EXTENSIONS, false, [
            new Item('{{marketplace}}/marketplace/addons', t('Add-ons')),
            new Item('{{marketplace}}/marketplace/themes', t('Themes')),
            new Item('{{marketing}}/extensions/related-projects', t('Related Projects')),
            new Item('{{marketing}}/extensions/translate', t('Translations')),
        ]));
        $navigation->add(new Item('{{marketing}}/support', t('Support'), false, $activeSection === self::SECTION_COMMUNITY, [
            new Item('{{marketing}}/support/hiring-help', t('Hiring Help')),
            new Item('{{documentation}}', t('Documentation')),
            new Item('{{forums}}', t('Forums')),
            new Item('{{marketing}}/support/training-certification', t('Training & Certification')),
        ]));
        $navigation->add(new Item('{{marketing}}/community', t('Community'), false, $activeSection === self::SECTION_COMMUNITY, [
            new Item('{{forums}}', t('Forums')),
            new Item('{{community}}/members/directory', t('Search Members')),
            new Item('{{marketing}}/extensions/translate', t('Translate')),
        ]));

        $modifier = new NavigationModifier();
        $modifier->addModifier($this->app->make(SiteUrlPlaceholderModifier::class));
        return $modifier->process($navigation);
    }
}
