<?php

namespace PortlandLabs\ConcreteCmsTheme\Theme;

use Concrete\Core\Page\Theme\Documentation\BedrockDocumentationPage;
use Concrete\Core\Page\Theme\Documentation\DocumentationPageInterface;
use Concrete\Core\Page\Theme\Documentation\DocumentationProviderInterface;
use Concrete\Core\Page\Theme\Documentation\ThemeDocumentationPage;
use Concrete\Package\ConcreteCmsTheme\Theme\ConcreteCms\PageTheme;

class DocumentationProvider implements DocumentationProviderInterface
{

    /**
     * @var PageTheme
     */
    protected $theme;

    public function __construct(PageTheme $theme)
    {
        $this->theme = $theme;
    }

    public function finishInstallation(): void
    {
        // Nothing
    }

    public function clearSupportingElements(): void
    {
        // Nothing
    }

    public function installSupportingElements(): void
    {
        // Nothing
    }

    /**
     * @return DocumentationPageInterface[]
     */
    public function getPages(): array
    {
        $pages = [
            new ThemeDocumentationPage($this->theme, 'Overview', 'overview.xml'),
            new BedrockDocumentationPage('Typography', 'typography.xml'),
            new BedrockDocumentationPage('Components', 'components.xml'),
        ];

        return $pages;
    }


}
