<?php

/**
 * @project:   ConcreteCMS Theme
 *
 * @copyright  (C) 2021 Portland Labs (https://www.portlandlabs.com)
 * @author     Fabian Bitter (fabian@bitter.de)
 */

namespace PortlandLabs\ConcreteCmsTheme;

use Concrete\Core\Application\Application;
use Concrete\Core\Config\Repository\Repository;
use Concrete\Core\Entity\File\File;
use Concrete\Core\Tree\Node\Type\GroupFolder;
use Concrete\Core\User\Group\Command\AddGroupCommand;
use Concrete\Core\User\Group\Group;
use Concrete\Core\User\Group\GroupList;
use Concrete\Core\User\Group\GroupRepository;
use Concrete\Core\User\Group\GroupType;
use Concrete\Core\User\User;
use Doctrine\DBAL\Exception;
use PortlandLabs\ConcreteCmsTheme\Exceptions\CantSendJoinRequest;
use PortlandLabs\ConcreteCmsTheme\Exceptions\InvalidGroup;
use PortlandLabs\ConcreteCmsTheme\Exceptions\InvalidGroupType;
use PortlandLabs\ConcreteCmsTheme\Exceptions\NotLoggedIn;
use PortlandLabs\ConcreteCmsTheme\Exceptions\NotPartOfGroup;

class TeamsService
{
    protected $app;
    protected $config;
    protected $groupRepository;

    public function __construct(
        Application $app,
        Repository $config,
        GroupRepository $groupRepository
    )
    {
        $this->app = $app;
        $this->config = $config;
        $this->groupRepository = $groupRepository;
    }

    /**
     * @param string $name
     * @param string|null $description
     * @param bool $petitionForPublicEntry
     * @param File|null $thumbnail
     * @return Group
     * @throws InvalidGroup
     * @throws NotLoggedIn
     */
    public function createTeam(
        string $name,
        ?string $description,
        ?bool $petitionForPublicEntry = false,
        ?File $thumbnail = null
    ): Group
    {
        $user = new User();

        if ($user->isRegistered()) {
            $command = new AddGroupCommand();
            $command->setName($name);

            if ($this->getTeamsGroupFolder() instanceof GroupFolder) {
                $command->setParentNodeID($this->getTeamsGroupFolder()->getTreeNodeID());
            }

            if (strlen($description) > 0) {
                $command->setDescription($description);
            }

            $group = $this->app->executeCommand($command);

            if ($group instanceof Group) {
                if ($this->getTeamsGroupType() instanceof GroupType) {
                    $group->setGroupType($this->getTeamsGroupType());
                    $group->setDefaultRole($this->getTeamsGroupType()->getDefaultRole());

                    foreach ($this->getTeamsGroupType()->getRoles() as $role) {
                        $group->addRole($role);
                    }
                }

                $group->setOverrideGroupTypeSettings(true);
                $group->setPetitionForPublicEntry($petitionForPublicEntry);

                if ($thumbnail instanceof File) {
                    $group->setThumbnailImage($thumbnail);
                }

                $user->enterGroup($group);

                foreach ($group->getRoles() as $userRole) {
                    if ($userRole->isManager()) {
                        $group->changeUserRole($user, $userRole);
                    }
                }

                return $group;
            } else {
                throw new InvalidGroup();
            }
        } else {
            throw new NotLoggedIn();
        }
    }

    /**
     * @param Group $team
     * @throws CantSendJoinRequest
     * @throws InvalidGroupType
     * @throws NotLoggedIn
     */
    public function enterTeam(
        Group $team
    ): void
    {
        $user = new User();

        if ($user->isRegistered()) {
            if ($this->getTeamsGroupType() instanceof GroupType && $team->getGroupType() instanceof GroupType) {
                if ($team->getGroupType()->getId() === $this->getTeamsGroupType()->getId()) {
                    if ($team->isPetitionForPublicEntry()) {
                        try {
                            $team->sendJoinRequest();
                        } catch (Exception $e) {
                            throw new CantSendJoinRequest();
                        }
                    } else {
                        $user->enterGroup($team);
                    }
                } else {
                    throw new InvalidGroupType();
                }
            }
        } else {
            throw new NotLoggedIn();
        }
    }

    /**
     * @param Group $team
     * @param User|null $user
     * @throws NotLoggedIn
     * @throws NotPartOfGroup
     */
    public function leaveTeam(
        Group $team,
        ?User $user = null
    ): void
    {
        if (!isset($user)) {
            $user = new User();
        }

        if ($user->isRegistered()) {
            if ($user->inGroup($team)) {
                $user->exitGroup($team);
            } else {
                throw new NotPartOfGroup();
            }
        } else {
            throw new NotLoggedIn();
        }
    }

    /**
     * @param int $teamId
     * @return Group
     * @throws InvalidGroupType
     * @throws NotLoggedIn
     */
    public function getTeamById(
        int $teamId
    ): Group
    {
        $team = $this->groupRepository->getGroupByID($teamId);

        if ($team instanceof Group) {
            if ($this->getTeamsGroupType() instanceof GroupType && $team->getGroupType() instanceof GroupType) {
                if ($team->getGroupType()->getId() === $this->getTeamsGroupType()->getId()) {
                    return $team;
                } else {
                    throw new InvalidGroupType();
                }
            } else {
                throw new InvalidGroupType();
            }
        } else {
            throw new NotLoggedIn();
        }
    }

    /**
     * @return GroupFolder
     */
    public function getTeamsGroupFolder(): GroupFolder
    {
        return GroupFolder::getByID($this->config->get("concrete_cms_theme.teams.group_folder", 0));
    }

    /**
     * @param GroupFolder $groupFolder
     */
    public function setTeamsGroupFolder(
        GroupFolder $groupFolder
    )
    {
        $this->config->save("concrete_cms_theme.teams.group_folder", $groupFolder->getTreeNodeID());
    }

    /**
     * @return GroupType
     */
    public function getTeamsGroupType(): GroupType
    {
        return GroupType::getByID($this->config->get("concrete_cms_theme.teams.group_type", 0));
    }

    /**
     * @param GroupType $groupType
     */
    public function setTeamsGroupType(
        GroupType $groupType
    )
    {
        $this->config->save("concrete_cms_theme.teams.group_type", $groupType->getId());
    }

    /**
     * @param string $keywords
     * @return Group[]
     */
    public function searchTeams(
        string $keywords
    ): iterable
    {
        $groupList = new GroupList();
        $groupList->filterByName($keywords);
        $groupList->filterByGroupType($this->getTeamsGroupType());
        $groups = $groupList->getResults();

        return $groups;
    }

    /**
     * @return Group[]
     */
    public function getUserTeams()
    {
        $user = new User();

        if ($user->isRegistered()) {
            $groupList = new GroupList();
            $groupList->filterByUserID($user->getUserID());
            $groupList->filterByGroupType($this->getTeamsGroupType());
            return $groupList->getResults();
        } else {
            return [];
        }
    }
}