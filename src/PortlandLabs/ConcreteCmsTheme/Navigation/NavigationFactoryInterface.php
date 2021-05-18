<?php

namespace PortlandLabs\ConcreteCmsTheme\Navigation;

use Concrete\Core\Navigation\NavigationInterface;

interface NavigationFactoryInterface
{
    /**
     * @param string|null $activeSection
     */
    public function setActiveSection(string $activeSection = null): void;

    public function createNavigation(): NavigationInterface;
}
