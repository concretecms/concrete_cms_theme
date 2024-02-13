<?php

namespace PortlandLabs\ConcreteCmsTheme\Navigation;

use Concrete\Core\Navigation\Item\Item;
use Concrete\Core\Navigation\Navigation;

class CommercialNavigation extends Navigation
{

    /**
     * @param string $activeSection
     */
    public function __construct(string $activeSection = null)
    {
        $this->add(new Item('{{marketing}}/about', t('Why Concrete?'), false, false, [
            new Item('{{marketing}}/about/reviews', t('Reviews')),
            new Item('{{marketing}}/content-creators', t('For Content Creators')),
            new Item('{{marketing}}/why-developers-love-concrete', t('For Developers')),
            new Item('{{marketing}}/about/features', t('Features')),
            new Item('{{marketing}}/about/case-studies ', t('Case Studies')),
            new Item('{{marketing}}/about/why-open-source', t('Open Source')),
        ]));
        $this->add(new Item('{{marketing}}/industries', t('Industries'), false, false, [
            new Item('{{marketing}}/solutions/banking-finance', t('Banking and Finance')),
            new Item('{{marketing}}/solutions/manufacturing', t('Manufacturing')),
            new Item('{{marketing}}/solutions/hospitals', t('Healthcare')),
            new Item('{{marketing}}/solutions/education', t('Education')),
            new Item('{{marketing}}/solutions/government-military', t('Government / Military')),
        ]));
        $this->add(new Item('{{marketing}}/applications', t('Applications'), false, false, [
            new Item('{{marketing}}/applications/web-content-management', t('Web Content Management')),
            new Item('{{marketing}}/about/applications/human-resources-portal', t('Human Resources Portals')),
            new Item('{{marketing}}/solutions/internal-communications-intranet', t('Intranets / Portals')),
            new Item('{{marketing}}/about/applications/digital-asset-management', t('Digital Asset Management')),
            new Item('{{marketing}}/applications/ecommerce', t('eCommerce')),
            new Item('{{marketing}}/solutions/multi-site', t('Multi-Site')),
            new Item('{{marketing}}/about/applications/product-catalog', t('Product Portal')),
            new Item('{{marketing}}/hosting', t('Hosting')),
        ]));
        $this->add(new Item('{{marketing}}/resources', t('Resources'), false, false, [
            new Item('{{marketing}}/support', t('Support')),
            new Item('{{marketing}}/about/blog', t('Blog')),
            new Item('{{marketing}}/extensions', t('Extensions')),
            new Item('{{documentation}}', t('Documentation')),
            new Item('{{forums}}', t('Forums')),
            new Item('{{community}}/members', t('Members')),
            new Item('{{marketing}}/internationalization', t('Internationalization')),
        ]));
        $this->add(new Item('{{marketing}}/get-started', t('Get Started'), false, false, [
            new Item('{{community}}/get-concrete-site', t('Try it Now!')),
            new Item('{{marketing}}/hosting-concrete-cms', t('Hosting')),
            new Item('{{marketing_org}}/download', t('Download Open Source')),
            new Item('{{marketing}}/demo', t('Sales Demo')),
        ]));
    }



}
