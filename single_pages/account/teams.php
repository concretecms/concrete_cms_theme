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
use Concrete\Core\User\User;
use Concrete\Core\Validation\CSRF\Token;
use Concrete\Core\View\View;

/** @var \Concrete\Core\User\Group\Group $selectedTeam */
/** @var \Concrete\Core\User\Group\Group[] $myTeams */

$app = Application::getFacadeApplication();
/** @var Form $form */
$form = $app->make(Form::class);
/** @var Token $token */
$token = $app->make(Token::class);

$user = new User();
?>

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

        <div class="row">
            <div class="col">
                <div class="card">
                    <div class="card-body">
                        <div class="card-title">
                                    <span>
                                        <?php echo t("My Teams"); ?>
                                    </span>
                        </div>

                        <div class="card-text">
                            <?php if (count($myTeams) === 0) { ?>
                                <p>
                                    <?php echo t("You don't have joined any teams yet."); ?>
                                </p>
                            <?php } else { ?>
                                <table class="table">
                                    <thead>
                                    <tr>
                                        <th>
                                            <?php echo t("Team"); ?>
                                        </th>

                                        <th>
                                            <?php echo t("Role"); ?>
                                        </th>

                                        <th>
                                            &nbsp;
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <?php foreach ($myTeams as $myTeam) { ?>
                                        <tr>
                                            <td>
                                                <?php echo $myTeam->getGroupName(); ?>
                                            </td>

                                            <td>
                                                <?php
                                                if ($myTeam->getAuthorID() == $user->getUserID()) {
                                                    echo t("Owner");
                                                } else {
                                                    echo $myTeam->getUserRole($user)->getName();
                                                }
                                                ?>
                                            </td>

                                            <td>
                                                <div class="float-right">
                                                    <div class="dropdown">
                                                        <a href="<?php echo (string)Url::to("/account/teams", "edit", $myTeam->getGroupID()); ?>"
                                                           class="btn btn-secondary btn-sm">
                                                            <?php echo t("View Team"); ?>
                                                        </a>
                                                    </div>
                                                </div>

                                                <div class="clearfix"></div>
                                            </td>
                                        </tr>
                                    <?php } ?>
                                    </tbody>
                                </table>
                            <?php } ?>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col">
                <div class="card">
                    <div class="card-body">
                        <div class="card-title">
                            <span>
                                <?php echo t("Join a Team"); ?>
                            </span>
                        </div>

                        <div class="card-text">
                            <p>
                                <?php echo t("Search for a team that you want to join."); ?>
                            </p>

                            <form action="<?php echo (string)Url::to("/account/teams", "enter"); ?>"
                                  method="post">
                                <?php echo $token->output("enter_team"); ?>

                                <div class="form-group">
                                    <?php echo $form->label("gID", t("Team")); ?>
                                    <?php echo $form->select("gID", [], ["class" => "ccm-teams-search"]); ?>
                                </div>

                                <button type="submit" class="btn btn-primary">
                                    <?php echo t("Join Team"); ?>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col">
                <div class="card">
                    <div class="card-body">
                        <div class="card-title">
                            <span>
                                <?php echo t("Create a Team"); ?>
                            </span>
                        </div>

                        <div class="card-text">
                            <form action="<?php echo (string)Url::to("/account/teams", "create"); ?>" method="post">
                                <?php echo $token->output("create_team"); ?>

                                <div class="form-group">
                                    <?php echo $form->label("name", t("Name")); ?>
                                    <?php echo $form->text("name"); ?>
                                </div>

                                <div class="form-group">
                                    <?php echo $form->label("description", t("Description")); ?>
                                    <?php echo $form->textarea("description"); ?>
                                </div>

                                <div class="form-group">
                                    <div class="form-check">
                                        <?php echo $form->checkbox("petitionForPublicEntry", 1, false); ?>
                                        <?php echo $form->label("petitionForPublicEntry", t("Petition For Public Entry")); ?>
                                    </div>
                                </div>

                                <button type="submit" class="btn btn-primary">
                                    <?php echo t("Create Team"); ?>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>