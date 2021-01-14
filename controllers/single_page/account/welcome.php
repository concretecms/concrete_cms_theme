<?php

/**
 * @project:   ConcreteCMS Theme
 *
 * @copyright  (C) 2021 Portland Labs (https://www.portlandlabs.com)
 * @author     Fabian Bitter (fabian@bitter.de)
 */

namespace Concrete\Package\ConcreteCmsTheme\Controller\SinglePage\Account;

use Concrete\Core\Http\Response;
use Concrete\Core\Support\Facade\Url;
use PortlandLabs\ConcreteCmsTheme\Page\Controller\AccountPageController;

class Welcome extends AccountPageController
{
    public function view()
    {
        return $this->responseFactory->redirect((string)Url::to("/"), Response::HTTP_TEMPORARY_REDIRECT);
    }
}