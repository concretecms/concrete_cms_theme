<?php

namespace PortlandLabs\ConcreteCmsTheme\SEO;

use PortlandLabs\ConcreteCmsTheme\SEO\Schema\SchemaManager;
use PortlandLabs\ConcreteCmsTheme\SEO\OpenGraph;

class Provider extends \Concrete\Core\Foundation\Service\Provider
{

    /**
     * Registers the services provided by this provider.
     */
    public function register()
    {
        $this->app->singleton(SchemaManager::class);
        $this->app->singleton(OpenGraph::class);
    }

    /**
     * Declare the classes that this provider is in charge of providing
     * @return array
     */
    public function provides()
    {
        return [
            SchemaManager::class,
            OpenGraph::class,
        ];
    }
}
