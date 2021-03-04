<?php

/**
 * @project:   ConcreteCMS Theme
 *
 * @copyright  (C) 2021 Portland Labs (https://www.portlandlabs.com)
 * @author     Fabian Bitter (fabian@bitter.de)
 */

defined('C5_EXECUTE') or die('Access Denied.');

use Concrete\Core\Form\Service\Form;
use Concrete\Core\Support\Facade\Application;
use Concrete\Core\Support\Facade\Url;
use Concrete\Core\Validation\CSRF\Token;
use Concrete\Core\View\View;

/** @var \Concrete\Core\User\Group\Group $selectedTeam */
/** @var \Concrete\Core\User\Group\Group[] $myTeams */

$app = Application::getFacadeApplication();
/** @var Form $form */
$form = $app->make(Form::class);
/** @var Token $token */
$token = $app->make(Token::class);

$user = new \Concrete\Core\User\User();

?>
<?php if ($selectedTeam instanceof \Concrete\Core\User\Group\Group) { ?>
    <div class="teams-page">
        <div class="container">
            <div class="row">
                <div class="col">
                    <h1 class="highlight">
                        <?php echo t("Teams"); ?>
                    </h1>

                    <p>
                        <?php echo t("Each level of certification build on the one before."); ?>
                    </p>
                </div>
            </div>

            <?php if ($selectedTeam->hasUserManagerPermissions($user)) { ?>
                <div class="row">
                    <div class="col">
                        <div class="card">
                            <div class="card-body">
                                <div class="card-title">
                                    <span>
                                        <?php echo t("Edit Details"); ?>
                                    </span>
                                </div>

                                <div class="card-text">
                                    <form action="<?php echo (string)Url::to("/account/teams", "edit", $selectedTeam->getGroupID()); ?>"
                                          method="post">
                                        <?php echo $token->output("edit_team"); ?>

                                        <div class="form-group">
                                            <?php echo $form->label("name", t("Name")); ?>
                                            <?php echo $form->text("name", $selectedTeam->getGroupName()); ?>
                                        </div>

                                        <div class="form-group">
                                            <?php echo $form->label("description", t("Description")); ?>
                                            <?php echo $form->textarea("description", $selectedTeam->getGroupDescription()); ?>
                                        </div>

                                        <div class="form-group">
                                            <div class="form-check">
                                                <?php echo $form->checkbox("petitionForPublicEntry", 1, $selectedTeam->isPetitionForPublicEntry()); ?>
                                                <?php echo $form->label("petitionForPublicEntry", t("Petition For Public Entry")); ?>
                                            </div>
                                        </div>

                                        <div class="float-right">
                                            <button type="submit" class="btn btn-primary">
                                                <?php echo t("Update Team"); ?>
                                            </button>
                                        </div>

                                        <div class="clearfix"></div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            <?php } else { ?>
                <div class="row">
                    <div class="col">
                        <div class="card">
                            <div class="card-body">
                                <div class="card-title">
                                        <span>
                                            <?php echo $selectedTeam->getGroupName(); ?>
                                        </span>
                                </div>

                                <div class="card-text">
                                    <?php echo $selectedTeam->getGroupDescription(); ?>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            <?php } ?>

            <div class="row">
                <div class="col">
                    <div class="card">
                        <div class="card-body">
                            <div class="card-title">
                                    <span>
                                        <?php echo t("Members"); ?>
                                    </span>
                            </div>

                            <div class="card-text">
                                <table class="table">
                                    <thead>
                                    <tr>
                                        <th>
                                            <?php echo t("User"); ?>
                                        </th>
                                        <th>
                                            &nbsp;
                                        </th>
                                    </tr>
                                    </thead>

                                    <tbody>
                                    <?php foreach ($selectedTeam->getGroupMembers() as $groupMember) { ?>
                                        <?php /** @var \Concrete\Core\User\User $groupMember */ ?>
                                        <tr>
                                            <td>
                                                <?php echo $groupMember->getUserName(); ?>
                                            </td>

                                            <td>
                                                <div class="float-right">
                                                    <?php if ($selectedTeam->hasUserManagerPermissions($user)) { ?>
                                                        <a href="<?php echo (string)Url::to(
                                                            "/account/teams/leave",
                                                            $selectedTeam->getGroupID(),
                                                            $groupMember->getUserID()
                                                        ); ?>" class="btn btn-danger btn-sm"">
                                                        <?php echo t("Remove From Group"); ?>
                                                        </a>
                                                    <?php } ?>
                                                    <a href="javascript:void(0);"
                                                       class="btn btn-secondary btn-sm send-message"
                                                       data-receiver="<?php echo h($groupMember->getUserID()); ?>">
                                                        <?php echo t("Send Message"); ?>
                                                    </a>

                                                    <a href="<?php echo (string)Url::to(
                                                        "/members/profile",
                                                        $groupMember->getUserID()
                                                    ); ?>" class="btn btn-primary btn-sm"">
                                                    <?php echo t("View Profile"); ?>
                                                    </a>
                                                </div>
                                                <div class="clearfix"></div>
                                            </td>
                                        </tr>
                                    <?php } ?>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <?php if ($selectedTeam->hasUserManagerPermissions($user) && count($selectedTeam->getJoinRequests()) > 0) { ?>
                <div class="row">
                    <div class="col">
                        <div class="card">
                            <div class="card-body">
                                <div class="card-title">
                                        <span>
                                            <?php echo t("Join Requests"); ?>
                                        </span>
                                </div>

                                <div class="card-text">
                                    <table class="table">
                                        <thead>
                                        <tr>
                                            <th>
                                                <?php echo t("User"); ?>
                                            </th>
                                            <th>
                                                &nbsp;
                                            </th>
                                        </tr>
                                        </thead>

                                        <tbody>
                                        <?php foreach ($selectedTeam->getJoinRequests() as $joinRequest) { ?>
                                            <tr>
                                                <td>
                                                    <?php echo $joinRequest->getUser()->getUserName(); ?>
                                                </td>

                                                <td>
                                                    <div class="float-right">
                                                        <a href="<?php echo (string)Url::to(
                                                            "/account/teams/decline_join_request",
                                                            $selectedTeam->getGroupID(),
                                                            $joinRequest->getUser()->getUserID()
                                                        ); ?>" class="btn btn-danger btn-sm">
                                                            <?php echo t("Decline"); ?>
                                                        </a>

                                                        <a href="<?php echo (string)Url::to(
                                                            "/account/teams/accept_join_request",
                                                            $selectedTeam->getGroupID(),
                                                            $joinRequest->getUser()->getUserID()
                                                        ); ?>" class="btn btn-secondary btn-sm">
                                                            <?php echo t("Accept"); ?>
                                                        </a>
                                                    </div>

                                                    <div class="clearfix"></div>
                                                </td>
                                            </tr>
                                        <?php } ?>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            <?php } ?>

            <?php if ($selectedTeam->getAuthorID() == $user->getUserID()) { ?>
                <div class="row">
                    <div class="col">
                        <div class="card">
                            <div class="card-body">
                                <div class="card-title">
                                    <span>
                                        <?php echo t("Delete Team"); ?>
                                    </span>
                                </div>

                                <div class="card-text">
                                    <p>
                                        <?php echo t("If you want to delete the team click the button below."); ?>
                                    </p>

                                    <a href="<?php echo (string)Url::to("/account/teams", "delete", $selectedTeam->getGroupID()); ?>"
                                       type="submit" class="btn btn-danger">
                                        <?php echo t("Delete Team"); ?>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            <?php } else { ?>
                <div class="row">
                    <div class="col">
                        <div class="card">
                            <div class="card-body">
                                <div class="card-title">
                                <span>
                                    <?php echo t("Leave Team"); ?>
                                </span>
                                </div>
                                <div class="card-text">
                                    <p>
                                        <?php echo t("If you want to leave the team click the button below."); ?>
                                    </p>

                                    <a href="<?php echo (string)Url::to("/account/teams", "leave", $selectedTeam->getGroupID()); ?>"
                                       type="submit" class="btn btn-danger">
                                        <?php echo t("Leave Team"); ?>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            <?php } ?>
        </div>
    </div>
<?php } ?>