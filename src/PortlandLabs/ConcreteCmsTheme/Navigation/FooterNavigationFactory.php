<?php

namespace PortlandLabs\ConcreteCmsTheme\Navigation;

use Concrete\Core\Application\ApplicationAwareInterface;
use Concrete\Core\Application\ApplicationAwareTrait;
use Concrete\Core\Navigation\Item\Item;
use Concrete\Core\Navigation\Modifier\FlatChildrenModifier;
use Concrete\Core\Navigation\Navigation;
use Concrete\Core\Navigation\NavigationModifier;
use PortlandLabs\ConcreteCmsTheme\Navigation\Modifier\SiteUrlPlaceholderModifier;

class FooterNavigationFactory implements ApplicationAwareInterface
{

    use ApplicationAwareTrait;

    /**
     * @TODO - update this with the actual values. There are certain things we need in here due to the way that
     * the footer nav works compared to the header. We need privacy policy, etc...
     */
    public function createNavigation()
    {
        $navigation = new Navigation();
        $navigation->add(new Item('{{marketing}}/about', t('About'), false, false, [
            new Item('{{marketing}}/about/features', t('Features')),
            new Item('{{marketing}}/about/blog', t('Blog')),
            new Item('{{marketing}}/about/case-studies', t('Case Studies')),
            new Item('{{marketing}}/about/governance', t('Governance')),
            new Item('{{marketing}}/about/roadmap', t('Road Map')),
            new Item('{{marketing}}/about/history', t('History')),
            new Item('{{marketing}}/about/solutions', t('Solutions')),
        ]));
        $navigation->add(new Item('{{marketing}}/get-started', t('Get Started'), false, false, [
            new Item('{{marketing}}/get-started/try', t('Try it Now!')),
            new Item('{{marketing}}/download', t('Download')),
            new Item('{{marketing}}/installation', t('Installation')),
        ]));
        $navigation->add(new Item('{{marketplace}}/support', t('Marketplace'), false, false, [
            new Item('{{marketplace}}/themes', t('Themes')),
            new Item('{{marketplace}}/addons', t('Add-Ons')),
            new Item('{{marketplace}}/starting-points', t('Starting Points')),
            new Item('{{documentation}}/marketplace-installation', t('Installation Help')),
        ]));
        $navigation->add(new Item('{{marketing}}/support', t('Support'), false, false, [
            new Item('{{documentation}}', t('Documentation')),
            new Item('{{training}}', t('Training & Certification')),
            new Item('{{gigs}}', t('Hire Help')),
        ]));
        $navigation->add(new Item('{{community}}', t('Community'), false, false, [
            new Item('{{forums}}', t('Forums')),
            new Item('{{community}}/members', t('Members')),
            new Item('{{translate}}', t('Translate Concrete')),
        ]));

        $modifier = new NavigationModifier();
        $modifier->addModifier($this->app->make(SiteUrlPlaceholderModifier::class));
        return $modifier->process($navigation);
    }
}