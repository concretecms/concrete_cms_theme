<?php
declare(strict_types=1);

namespace PortlandLabs\ConcreteCmsTheme\Navigation;


trait NavigationFactoryTrait
{

    /** @var null|string */
    protected $activeSection = null;

    public function setActiveSection(string $activeSection = null): void
    {
        $this->activeSection = $activeSection ?: null;
    }

}
