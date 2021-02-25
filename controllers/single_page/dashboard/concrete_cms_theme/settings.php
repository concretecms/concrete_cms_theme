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
use Concrete\Core\Tree\Node\Type\GroupFolder;
use Concrete\Core\Tree\Type\Group as GroupTree;
use Concrete\Core\User\Group\GroupType;
use PortlandLabs\ConcreteCmsTheme\TeamsService;
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
        /** @var TeamsService $teamsService */
        $teamsService = $this->app->make(TeamsService::class);

        $tree = GroupTree::get();
        $this->set('tree', $tree);
        $this->set('submitKarmaRequestPage', $config->get("concrete_cms_theme.submit_karma_request_page", 0));
        $this->set('enableDarkMode', $config->get("concrete_cms_theme.enable_dark_mode", false));
        $this->set('teamsGroupFolderId', $teamsService->getTeamsGroupFolder() instanceof GroupFolder ? $teamsService->getTeamsGroupFolder()->getTreeNodeID() : 0);
        $this->set('teamsGroupTypeId', $teamsService->getTeamsGroupType() instanceof GroupType ? $teamsService->getTeamsGroupType()->getId() : 0);
    }

    public function view()
    {
        /** @var Repository $config */
        $config = $this->app->make(Repository::class);
        /** @var ResponseFactory $responseFactory */
        $responseFactory = $this->app->make(ResponseFactory::class);
        /** @var TeamsService $teamsService */
        $teamsService = $this->app->make(TeamsService::class);

        if ($this->request->getMethod() === "POST") {
            if ($this->token->validate("update_settings")) {
                $config->save("concrete_cms_theme.submit_karma_request_page", (int)$this->request->request->get("submitKarmaRequestPage"));
                $config->save("concrete_cms_theme.enable_dark_mode", $this->request->request->has("enableDarkMode"));
                $teamsService->setTeamsGroupFolder(GroupFolder::getByID($this->request->request->get("teamsGroupFolderId")));
                $teamsService->setTeamsGroupType(GroupType::getByID($this->request->request->get("teamsGroupTypeId")));
                return $responseFactory->redirect(Url::to("/dashboard/concrete_cms_theme/settings/updated"), Response::HTTP_TEMPORARY_REDIRECT);
            } else {
                $this->error->add($this->token->getErrorMessage());
            }
        }

        $this->setDefaults();
    }

}
