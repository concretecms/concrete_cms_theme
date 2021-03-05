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
use Concrete\Core\Page\Controller\DashboardSitePageController;
use Concrete\Core\Support\Facade\Url;
use Symfony\Component\HttpFoundation\Response;

class Settings extends DashboardSitePageController
{
    public function updated()
    {
        $this->set('success', t("The settings has been successfully updated."));
        $this->setDefaults();
    }

    private function setDefaults()
    {

        $siteConfig = $this->getSite()->getConfigRepository();
        $this->set('enableDarkMode', $siteConfig->get('concrete_cms_theme.enable_dark_mode', false));

        /** @var Repository $config */
        $config = $this->app->make(Repository::class);
        $this->set('enableDarkMode', $config->get("concrete_cms_theme.enable_dark_mode", false));
    }

    public function view()
    {
        $siteConfig = $this->getSite()->getConfigRepository();

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
