<?php

namespace PortlandLabs\ConcreteCmsTheme\Navigation;

use Concrete\Core\Application\ApplicationAwareInterface;
use Concrete\Core\Application\ApplicationAwareTrait;
use Concrete\Core\Navigation\Item\Item;
use Concrete\Core\Navigation\Modifier\FlatChildrenModifier;
use Concrete\Core\Navigation\Navigation;
use Concrete\Core\Navigation\NavigationModifier;
use PortlandLabs\ConcreteCmsTheme\Navigation\Modifier\SiteUrlPlaceholderModifier;

class HeaderNavigationFactory implements ApplicationAwareInterface
{

    use ApplicationAwareTrait;

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
        $navigation->add(new Item('{{marketplace}}', t('Extensions')));
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