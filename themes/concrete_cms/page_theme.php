<?php

/**
 * @project:   ConcreteCMS Theme
 *
 * @copyright  (C) 2021 Portland Labs (https://www.portlandlabs.com)
 * @author     Fabian Bitter (fabian@bitter.de)
 */

namespace Concrete\Package\ConcreteCmsTheme\Theme\ConcreteCms;

use Concrete\Core\Area\Layout\Preset\Provider\ThemeProviderInterface;
use Concrete\Core\Feature\Features;
use Concrete\Core\Page\Theme\BedrockThemeTrait;
use Concrete\Core\Page\Theme\Theme;

class PageTheme extends Theme implements ThemeProviderInterface
{
    use BedrockThemeTrait;

    public function getThemeName()
    {
        return t('ConcreteCMS Theme');
    }

    public function getThemeDescription()
    {
        return t('The official ConcreteCMS Theme.');
    }

    public function getThemeResponsiveImageMap()
    {
        return [
            'large' => '900px',
            'medium' => '768px',
            'small' => '0',
        ];
    }

    public function getThemeSupportedFeatures()
    {
        return [
            Features::BASICS,
            Features::CALENDAR,
            Features::CONVERSATIONS,
            Features::FAQ,
            Features::NAVIGATION,
            Features::IMAGERY,
            Features::FORMS,
            Features::SEARCH,
            Features::TESTIMONIALS,
            Features::TAXONOMY,
        ];
    }

    public function getThemeAreaLayoutPresets()
    {
        return [];
    }

}
