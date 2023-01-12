<?php

namespace PortlandLabs\ConcreteCmsTheme\Navigation;

use Concrete\Core\Application\ApplicationAwareInterface;
use Concrete\Core\Application\ApplicationAwareTrait;
use Concrete\Core\Navigation\Item\Item;
use Concrete\Core\Navigation\Modifier\FlatChildrenModifier;
use Concrete\Core\Navigation\Navigation;
use Concrete\Core\Navigation\NavigationModifier;
use PortlandLabs\ConcreteCmsTheme\Navigation\Modifier\SiteUrlPlaceholderModifier;

/**
 * Class FooterNavigationFactory
 * NOTE: This is no longer used. In CS-826 we removed the footer. However, I think it's nice to leave this code here
 * in case we need it, so this is being done intentionally. Same with the footer_navigation controller and view.
 * The only code I removed with the Element::get('footer_navigation')->render() code from the theme footer include.
 */
class FooterNavigationFactory implements ApplicationAwareInterface
{

    use ApplicationAwareTrait;

    public function createNavigation()
    {
        $navigation = new Navigation();
        $navigation->add(new Item('{{marketing}}/about', t('About'), false, false, [
            new Item('{{marketing}}/about/features', t('Features')),
            new Item('{{marketing}}/about/case-studies', t('Case Studies')),
            new Item('{{marketing}}/about/solutions', t('Solutions')),
            new Item('{{marketing}}/about/blog', t('Blog')),
            new Item('{{marketing}}/about/contact-us', t('Contact')),
            new Item('{{marketing}}/about/partners', t('Partners')),
            new Item('{{marketing}}/about/legal/terms-use', t('Terms of Use')),
            new Item('{{marketing}}/about/legal/privacy-policy', t('Privacy Policy')),
            new Item('{{marketing_org}}/security', t('Security')),
        ]));
        $navigation->add(new Item('{{marketing}}/get-started', t('Get Started'), false, false, [
            new Item('{{marketing}}/about/solutions', t('Solutions')),
            new Item('{{marketing}}/hosting', t('Hosting')),
            new Item('{{marketing_org}}/download', t('Download')),
            new Item('{{documentation}}/developers/introduction/installation', t('Installation')),
        ]));
        $navigation->add(new Item('{{marketing}}/extensions', t('Extensions'), false, false, [
            new Item('{{marketplace}}/marketplace/addons', t('Add-ons')),
            new Item('{{marketplace}}/marketplace/themes', t('Themes')),
            new Item('{{marketing}}/extensions/related-projects', t('Related Projects')),
            new Item('{{marketing}}/extensions/translate', t('Translations')),
            new Item('{{marketing}}/about/legal/refund-policy', t('Refund Policy')),
        ]));
        $navigation->add(new Item('{{marketing}}/support', t('Support'), false, false, [
            new Item('{{marketing}}/support/hiring-help', t('Hiring Help')),
            new Item('{{documentation}}', t('Documentation')),
            new Item('{{forums}}', t('Forums')),
            new Item('{{marketing}}/support/training-certification', t('Training & Certification')),
        ]));
        $navigation->add(new Item('{{marketing}}/community', t('Community'), false, false, [
            new Item('{{forums}}', t('Forums')),
            new Item('{{community}}/members/directory', t('Search Members')),
            new Item('{{marketing}}/extensions/translate', t('Translate')),
            new Item('{{marketing_org}}/town-halls', t('Town Halls')),
        ]));
        
        $modifier = new NavigationModifier();
        $modifier->addModifier($this->app->make(SiteUrlPlaceholderModifier::class));
        return $modifier->process($navigation);
    }
}