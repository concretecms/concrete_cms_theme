<?php

/**
 * @project:   ConcreteCMS Theme
 *
 * @copyright  (C) 2021 Portland Labs (https://www.portlandlabs.com)
 * @author     Fabian Bitter (fabian@bitter.de)
 */

namespace Concrete\Package\ConcreteCmsTheme\Controller\SinglePage\Dashboard\ConcreteCmsTheme;

use Concrete\Core\Config\Repository\Repository;
use Concrete\Core\Http\ResponseFactory;
use Concrete\Core\Page\Controller\DashboardPageController;
use Concrete\Core\Support\Facade\Url;
use Symfony\Component\HttpFoundation\Response;

class Settings extends DashboardPageController
{
    public function updated()
    {
        $this->set('success', t("The settings has been successfully updated."));
        $this->setDefaults();
    }

    private function setDefaults()
    {
        /** @var Repository $config */
        $config = $this->app->make(Repository::class);
        $this->set('enableDarkMode', $config->get("concrete_cms_theme.enable_dark_mode", false));
    }

    public function view()
    {
        /** @var Repository $config */
        $config = $this->app->make(Repository::class);
        /** @var ResponseFactory $responseFactory */
        $responseFactory = $this->app->make(ResponseFactory::class);

        if ($this->request->getMethod() === "POST") {
            if ($this->token->validate("update_settings")) {
                $config->save("concrete_cms_theme.enable_dark_mode", $this->request->request->has("enableDarkMode"));
                return $responseFactory->redirect(Url::to("/dashboard/concrete_cms_theme/settings/updated"), Response::HTTP_TEMPORARY_REDIRECT);
            } else {
                $this->error->add($this->token->getErrorMessage());
            }
        }

        $this->setDefaults();
    }

}
