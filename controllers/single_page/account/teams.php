<?php /** @noinspection PhpInconsistentReturnPointsInspection */
/** @noinspection PhpUnused */
/** @noinspection DuplicatedCode */

/**
 * @project:   ConcreteCMS Theme
 *
 * @copyright  (C) 2021 Portland Labs (https://www.portlandlabs.com)
 * @author     Fabian Bitter (fabian@bitter.de)
 */

namespace Concrete\Package\ConcreteCmsTheme\Controller\SinglePage\Account;

use Concrete\Core\Form\Service\Validation;
use Concrete\Core\Http\Response;
use Concrete\Core\Page\Page;
use Concrete\Core\Support\Facade\Facade;
use Concrete\Core\Support\Facade\Url;
use Concrete\Core\User\Group\Command\DeleteGroupCommand;
use Concrete\Core\User\User;
use PortlandLabs\ConcreteCmsTheme\Exceptions\CantSendJoinRequest;
use PortlandLabs\ConcreteCmsTheme\Exceptions\InvalidGroup;
use PortlandLabs\ConcreteCmsTheme\Exceptions\InvalidGroupType;
use PortlandLabs\ConcreteCmsTheme\Exceptions\NotLoggedIn;
use PortlandLabs\ConcreteCmsTheme\Exceptions\NotPartOfGroup;
use PortlandLabs\ConcreteCmsTheme\Page\Controller\AccountPageController;
use PortlandLabs\ConcreteCmsTheme\TeamsService;

class Teams extends AccountPageController
{
    /** @var TeamsService */
    protected $teamsService;
    /** @var Validation */
    protected $validation;

    public function on_start()
    {
        parent::on_start();

        $this->teamsService = $this->app->make(TeamsService::class);
        $this->validation = $this->app->make(Validation::class);
    }

    public function entered()
    {
        $this->set("success", t("Congratulations! You have successfully joined the team."));
        $this->setDefaults();
    }

    public function created()
    {
        $this->set("success", t("Congratulations! You have successfully created the team."));
        $this->setDefaults();
    }

    public function deleted()
    {
        $this->set("success", t("Congratulations! You have successfully deleted the team."));
        $this->setDefaults();
    }

    public function updated()
    {
        $this->set("success", t("Congratulations! You have successfully updated the team."));
        $this->setDefaults();
    }

    public function join_request_sent()
    {
        $this->set("success", t("A join request was sent. Please be patient until a team manager has processed your request."));
        $this->setDefaults();
    }

    public function leaved()
    {
        $this->set("success", t("You have successfully leaved the team."));
        $this->setDefaults();
    }

    public function join_request_declined()
    {
        $this->set("success", t("You have successfully declined the join request."));
        $this->setDefaults();
    }

    public function join_request_accepted()
    {
        $this->set("success", t("You have successfully accepted the join request."));
        $this->setDefaults();
    }

    public function enter($teamId = null)
    {
        if ($this->request->getMethod() === "POST") {
            if ($teamId === null && $this->request->request->get("gID")) {
                $teamId = $this->request->request->get("gID");
            }

            $this->validation->setData($this->request->request->all());
            $this->validation->addRequiredToken("enter_team");
            $this->validation->addRequired("gID", t("You need to select a team."));

            if ($this->validation->test()) {
                try {
                    $team = $this->teamsService->getTeamById((int)$teamId);
                    $this->teamsService->enterTeam($team);

                    if ($team->isPetitionForPublicEntry()) {
                        return $this->responseFactory->redirect((string)Url::to("/account/teams", "join_request_sent"), Response::HTTP_TEMPORARY_REDIRECT);
                    } else {
                        return $this->responseFactory->redirect((string)Url::to("/account/teams", "entered"), Response::HTTP_TEMPORARY_REDIRECT);
                    }
                } catch (InvalidGroupType $e) {
                    $this->error->add(t("The given team has an invalid group type."));
                } catch (NotLoggedIn $e) {
                    return $this->responseFactory->forbidden((string)Url::to(Page::getCurrentPage()));
                } catch (CantSendJoinRequest $e) {
                    $this->error->add(t("There was an error while joining the team."));
                }
            } else {
                foreach ($this->validation->getError()->getList() as $error) {
                    $this->error->add($error);
                }
            }
        }

        $this->setDefaults();
    }

    public function leave($teamId = null, $userId = null)
    {
        $user = new User();

        try {
            $team = $this->teamsService->getTeamById((int)$teamId);

            if ((!$user->isRegistered() || !$user->inGroup($team)) && !$user->isSuperUser()) {
                return $this->responseFactory->forbidden((string)Url::to(Page::getCurrentPage()));
            }

            $this->set('selectedTeam', $team);

            if (isset($userId)) {
                if ($team->hasUserManagerPermissions($user)) {
                    $targetUser = User::getByUserID($userId);

                    if ($targetUser->isRegistered()) {
                        if ((int)$targetUser->getUserID() == (int)$team->getAuthorID()) {
                            $this->error->add(t("You can't leave this team because you are the owner of this group."));
                        } else {
                            $this->teamsService->leaveTeam($team, $targetUser);
                            return $this->responseFactory->redirect((string)Url::to("/account/teams", "leaved"), Response::HTTP_TEMPORARY_REDIRECT);
                        }
                    } else {
                        $this->error->add(t("The given user doesn't exists."));
                    }
                } else {
                    $this->error->add(t("You don't have the permission to remove the user."));
                }
            } else {
                $this->teamsService->leaveTeam($team);
                return $this->responseFactory->redirect((string)Url::to("/account/teams", "leaved"), Response::HTTP_TEMPORARY_REDIRECT);
            }

        } catch (InvalidGroupType $e) {
            $this->error->add(t("The given team has an invalid group type."));
        } catch (NotLoggedIn $e) {
            return $this->responseFactory->forbidden((string)Url::to(Page::getCurrentPage()));
        } catch (NotPartOfGroup $e) {
            $this->error->add(t("You are not part of this team."));
        }

        $this->setDefaults();
        $this->render("/account/teams/edit");
    }

    public function accept_join_request($teamId = null, $userId = null)
    {
        $user = new User();

        try {
            $team = $this->teamsService->getTeamById((int)$teamId);

            if ((!$user->isRegistered() || !$user->inGroup($team)) && !$user->isSuperUser()) {
                return $this->responseFactory->forbidden((string)Url::to(Page::getCurrentPage()));
            }

            $this->set('selectedTeam', $team);

            if ($team->hasUserManagerPermissions($user)) {
                foreach ($team->getJoinRequests() as $joinRequest) {
                    if ($joinRequest->getUser()->getUserID() == $userId) {
                        $joinRequest->accept();
                        return $this->responseFactory->redirect((string)Url::to("/account/teams", "join_request_accepted"), Response::HTTP_TEMPORARY_REDIRECT);
                    }
                }

                $this->error->add(t("The given user has not sent a join request.."));
            } else {
                return $this->responseFactory->forbidden((string)Url::to(Page::getCurrentPage()));
            }
        } catch (InvalidGroupType $e) {
            $this->error->add(t("The given team has an invalid group type."));
        } catch (NotLoggedIn $e) {
            return $this->responseFactory->forbidden((string)Url::to(Page::getCurrentPage()));
        }

        $this->setDefaults();
        $this->render("/account/teams/edit");
    }

    public function decline_join_request($teamId = null, $userId = null)
    {
        $user = new User();

        try {
            $team = $this->teamsService->getTeamById((int)$teamId);

            if ((!$user->isRegistered() || !$user->inGroup($team)) && !$user->isSuperUser()) {
                return $this->responseFactory->forbidden((string)Url::to(Page::getCurrentPage()));
            }

            $this->set('selectedTeam', $team);

            if ($team->hasUserManagerPermissions($user)) {
                foreach ($team->getJoinRequests() as $joinRequest) {
                    if ($joinRequest->getUser()->getUserID() == $userId) {
                        $joinRequest->decline();
                        return $this->responseFactory->redirect((string)Url::to("/account/teams", "join_request_declined"), Response::HTTP_TEMPORARY_REDIRECT);
                    }
                }

                $this->error->add(t("The given user has not sent a join request.."));
            } else {
                return $this->responseFactory->forbidden((string)Url::to(Page::getCurrentPage()));
            }
        } catch (InvalidGroupType $e) {
            $this->error->add(t("The given team has an invalid group type."));
        } catch (NotLoggedIn $e) {
            return $this->responseFactory->forbidden((string)Url::to(Page::getCurrentPage()));
        }

        $this->setDefaults();
        $this->render("/account/teams/edit");
    }

    public function edit($teamId = null)
    {
        $user = new User();

        try {
            $team = $this->teamsService->getTeamById((int)$teamId);

            if ((!$user->isRegistered() || !$user->inGroup($team)) && !$user->isSuperUser()) {
                return $this->responseFactory->forbidden((string)Url::to(Page::getCurrentPage()));
            }

            $this->set('selectedTeam', $team);

            if ($this->request->getMethod() === "POST") {
                $name = $this->request->request->get("name");
                $description = $this->request->request->get("description");
                $petitionForPublicEntry = $this->request->request->has("petitionForPublicEntry");

                $this->validation->setData($this->request->request->all());
                $this->validation->addRequiredToken("edit_team");
                $this->validation->addRequired("name", t("You need to enter a name for the team."));

                if ($this->validation->test()) {
                    $team->update($name, $description);
                    $team->setPetitionForPublicEntry($petitionForPublicEntry);

                    // @todo: set image from uploaded file

                    return $this->responseFactory->redirect((string)Url::to("/account/teams", "updated"), Response::HTTP_TEMPORARY_REDIRECT);
                } else {
                    foreach ($this->validation->getError()->getList() as $error) {
                        $this->error->add($error);
                    }
                }
            }

        } catch (InvalidGroupType $e) {
            $this->error->add(t("The given team has an invalid group type."));
        } catch (NotLoggedIn $e) {
            return $this->responseFactory->forbidden((string)Url::to(Page::getCurrentPage()));
        }

        $this->setDefaults();
        $this->render("/account/teams/edit");
    }

    public function delete($teamId = null)
    {
        $user = new User();

        try {
            $team = $this->teamsService->getTeamById((int)$teamId);

            if ((!$user->isRegistered() || !$user->inGroup($team)) && !$user->isSuperUser()) {
                return $this->responseFactory->forbidden((string)Url::to(Page::getCurrentPage()));
            }

            $this->set('selectedTeam', $team);

            if ((int)$user->getUserID() == (int)$team->getAuthorID()) {
                $this->app->executeCommand(new DeleteGroupCommand($team->getGroupID()));
                return $this->responseFactory->redirect((string)Url::to("/account/teams", "deleted"), Response::HTTP_TEMPORARY_REDIRECT);
            } else {
                $this->error->add(t("You are not the owner of this team."));
            }

        } catch (InvalidGroupType $e) {
            $this->error->add(t("The given team has an invalid group type."));
        } catch (NotLoggedIn $e) {
            return $this->responseFactory->forbidden((string)Url::to(Page::getCurrentPage()));
        }

        $this->setDefaults();
        $this->render("/account/teams/edit");
    }

    public function create()
    {
        if ($this->request->getMethod() === "POST") {
            $name = $this->request->request->get("name");
            $description = $this->request->request->get("description");
            $petitionForPublicEntry = $this->request->request->has("petitionForPublicEntry");

            $this->validation->setData($this->request->request->all());
            $this->validation->addRequiredToken("create_team");
            $this->validation->addRequired("name", t("You need to enter a name for the team."));

            if ($this->validation->test()) {
                try {
                    $this->teamsService->createTeam($name, $description, $petitionForPublicEntry);

                    // @todo: set image from uploaded file

                    return $this->responseFactory->redirect((string)Url::to("/account/teams", "created"), Response::HTTP_TEMPORARY_REDIRECT);
                } catch (InvalidGroup $e) {
                    $this->error->add(t("There was an error while creating the group."));
                } catch (NotLoggedIn $e) {
                    return $this->responseFactory->forbidden((string)Url::to(Page::getCurrentPage()));
                }
            } else {
                foreach ($this->validation->getError()->getList() as $error) {
                    $this->error->add($error);
                }
            }
        }

        $this->setDefaults();
    }

    private function setDefaults()
    {
        $this->set('myTeams', $this->teamsService->getUserTeams());
    }

    public function view($teamId = null)
    {
        $user = new User();

        $this->setDefaults();

        if (isset($teamId)) {
            try {
                $team = $this->teamsService->getTeamById((int)$teamId);

                if ((!$user->isRegistered() || !$user->inGroup($team)) && !$user->isSuperUser()) {
                    return $this->responseFactory->forbidden((string)Url::to(Page::getCurrentPage()));
                }

                $this->set('selectedTeam', $team);

            } catch (InvalidGroupType $e) {
                $this->error->add(t("The given team has an invalid group type."));
            } catch (NotLoggedIn $e) {
                return $this->responseFactory->forbidden((string)Url::to(Page::getCurrentPage()));
            }

            $this->render("/account/teams/edit");
        }

    }
}