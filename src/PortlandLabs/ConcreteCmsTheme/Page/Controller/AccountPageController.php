<?php

/**
 * @project:   ConcreteCMS Theme
 *
 * @copyright  (C) 2021 Portland Labs (https://www.portlandlabs.com)
 * @author     Fabian Bitter (fabian@bitter.de)
 */

namespace PortlandLabs\ConcreteCmsTheme\Page\Controller;

use Concrete\Core\Error\ErrorList\ErrorList;
use Concrete\Core\Http\ResponseFactory;
use Concrete\Core\Page\Controller\AccountPageController as CoreAccountPageController;

class AccountPageController extends CoreAccountPageController
{
    /** @var ErrorList */
    protected $error;
    /** @var ResponseFactory */
    protected $responseFactory;

    public function on_start()
    {
        parent::on_start();

        $this->set('exclude_breadcrumb', true);
        $this->requireAsset("core/cms");

        $this->responseFactory = $this->app->make(ResponseFactory::class);
    }
}