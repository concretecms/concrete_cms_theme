<?php

namespace PortlandLabs\ConcreteCmsTheme\Navigation;

use Concrete\Core\Navigation\Item\Item;
use Concrete\Core\Navigation\Navigation;

class OpenSourceHeaderNavigation extends Navigation
{

    /**
     * @param string $activeSection
     */
    public function __construct(string $activeSection = null)
    {
        $this->add(new Item('{{marketing_org}}', t('About'), false, false, [
            new Item('{{marketing_org}}/vision', t('Vision')),
            new Item('{{marketing_org}}/security', t('Security')),
            new Item('{{marketing_org}}/about/project-news/core-releases', t('Releases')),
            new Item('{{marketing_org}}/town-halls', t('Town Halls')),
            new Item('{{marketing_org}}/open-source-license ', t('License')),
            new Item('{{marketing_org}}/get-involved', t('Get Involved')),
            new Item('{{marketing_org}}/about/project-news', t('Project News')),
        ]));
        $this->add(new Item('{{marketing}}/get-started', t('Get Started'), false, false, [
            new Item('{{marketing}}/hosting', t('Hosting')),
            new Item('{{marketing_org}}/download', t('Download')),
            new Item('{{documentation}}/developers/introduction/installing-concrete-cms', t('Installation')),
        ]));
        $this->add(new Item('{{marketing}}/extensions', t('Extensions'), false, false, [
            new Item('{{marketplace}}/marketplace/addons', t('Add-ons')),
            new Item('{{marketplace}}/marketplace/themes', t('Themes')),
            new Item('{{marketing}}/extensions/related-projects', t('Related Projects')),
            new Item('{{translate}}/translate/package/concrete5', t('Translations')),
        ]));
        $this->add(new Item('{{documentation}}', t('Documentation'), false, $activeSection === HeaderNavigationFactory::SECTION_DOCUMENTATION));
        $this->add(new Item('{{marketing}}/community', t('Community'), false, $activeSection === HeaderNavigationFactory::SECTION_COMMUNITY, [
            new Item('{{forums}}', t('Forums')),
            new Item('{{marketing}}/extensions/translate', t('Translate')),
            new Item('{{community}}/members/directory', t('Search Members')),
        ]));
    }



}
