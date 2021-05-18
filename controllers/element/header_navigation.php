<?php

/**
 * @project:   ConcreteCMS Theme
 *
 * @copyright  (C) 2021 Portland Labs (https://www.portlandlabs.com)
 * @author     Fabian Bitter (fabian@bitter.de)
 */

namespace Concrete\Package\ConcreteCmsTheme\Controller\Element;

use Concrete\Core\Controller\ElementController;
use Concrete\Core\Validation\CSRF\Token;
use PortlandLabs\ConcreteCmsTheme\Navigation\HeaderNavigationFactory;
use PortlandLabs\ConcreteCmsTheme\Navigation\MyAccountNavigationFactory;

class HeaderNavigation extends ElementController
{

    /**
     * @var HeaderNavigationFactory
     */
    private $headerFactory;

    /**
     * @var MyAccountNavigationFactory
     */
    private $myAccountNavigationFactory;

    public function __construct(HeaderNavigationFactory $headerFactory, MyAccountNavigationFactory $myAccountNavigationFactory)
    {
        $this->headerFactory = $headerFactory;
        $this->myAccountNavigationFactory = $myAccountNavigationFactory;
    }

    public function getElement()
    {
        return 'header_navigation';
    }

    public function view()
    {
        $navigationFactory = $this->app->make(HeaderNavigationFactory::class);
        $accountNavigationFactory = $this->app->make(MyAccountNavigationFactory::class);

        $this->set('token', new Token());
        $this->set('headerNavigation', $this->headerFactory->createNavigation());
        $this->set('accountNavigation', $this->myAccountNavigationFactory->createNavigation());
    }
}
