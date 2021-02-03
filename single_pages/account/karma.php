<?php

/**
 * @project:   ConcreteCMS Theme
 *
 * @copyright  (C) 2021 Portland Labs (https://www.portlandlabs.com)
 * @author     Fabian Bitter (fabian@bitter.de)
 */

defined('C5_EXECUTE') or die('Access Denied.');

use Concrete\Core\Localization\Service\Date;
use Concrete\Core\Support\Facade\Application;
use Concrete\Core\Support\Facade\Url;
use Concrete\Core\User\Point\Entry;
use Concrete\Core\User\User;

/** @var Entry[] $entries */
/** @var array $myTotalList */
/** @var bool $hasNextPage */

$app = Application::getFacadeApplication();
/** @var Date $dateService */
$dateService = $app->make(Date::class);
?>

<div class="karma-page">
    <div class="container">
        <div class="row">
            <div class="col">
                <h1 class="highlight">
                    <?php echo t("Karma"); ?>
                </h1>

                <p>
                    <?php echo t("Earn points and badges as you continue to use and create with Concrete. Helping others, promoting projects and doings various things within the community can generate points and badges. See below what you’ve won and what other types of badges are out there for you to earn."); ?>
                </p>
            </div>
        </div>

        <div class="row">
            <div class="col-lg-8" id="karma-list">
                <div class="card">
                    <div class="card-body">
                        <div class="card-title">
                            <span>
                                <?php echo t("Karma Earned (Everyone)"); ?>
                            </span>
                        </div>

                        <div class="card-text">
                            <?php if (count($entries) === 0) { ?>
                                <p>
                                    <?php echo t("No karma entries available."); ?>
                                </p>
                            <?php } else { ?>
                                <div id="karma-container">
                                    <?php foreach ($entries as $entry) { ?>
                                        <?php
                                        $targetUser = new User($entry->getUserPointEntryUserID());
                                        ?>
                                        <div class="karma-entry">
                                            <div class="row">
                                                <div class="col-auto profile-picture">
                                                    <div class="profile-image">
                                                        <div class="image-wrapper">
                                                            <?php echo $targetUser->getUserInfoObject()->getUserAvatar()->output(); ?>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div class="col infos">
                                                    <p class="text-muted">
                                                        <?php
                                                        try {
                                                            $date = $dateService->formatDateTime($entry->getUserPointEntryDateTime());
                                                        } catch (Exception $e) {
                                                            $date = t("n/a");
                                                        }

                                                        /** @noinspection HtmlUnknownTarget */
                                                        echo t("Awarded to %s on %s",
                                                            sprintf(
                                                                "<a href=\"%s\">%s</a>",
                                                                (string)Url::to("/members/profile", $entry->getUserPointEntryUserID()),
                                                                $targetUser->getUserName()
                                                            ),
                                                            $date
                                                        );
                                                        ?>
                                                    </p>

                                                    <h3>
                                                        <?php
                                                        if (is_object($entry->getUserPointEntryActionObject())) {
                                                            echo $entry->getUserPointEntryActionObject()->getUserPointActionName();
                                                        } else {
                                                            echo t("Received Extra-Karma");
                                                        }
                                                        ?>
                                                    </h3>

                                                    <p>
                                                        <?php
                                                        if (strlen($entry->getUserPointEntryDescription()) > 0) {
                                                            echo $entry->getUserPointEntryDescription();
                                                        } else {
                                                            echo t("Thanks for taking the time!");
                                                        }
                                                        ?>
                                                    </p>
                                                </div>


                                                <div class="col points">
                                                    <h3 class="float-right">
                                                        <?php echo number_format($entry->getUserPointEntryValue()); ?>
                                                    </h3>
                                                </div>
                                            </div>

                                            <div class="clearfix"></div>
                                        </div>

                                    <?php } ?>
                                </div>

                                <div id="load-more" class="<?php echo $hasNextPage ? "" : "d-none"; ?>">
                                    <div class="text-center">
                                        <a href="javascript:void(0);">
                                            <?php echo t("Load More"); ?>
                                        </a>
                                    </div>
                                </div>
                            <?php } ?>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-lg-4" id="my-karma">
                <div class="card">
                    <div class="card-body">
                        <div class="card-title">
                            <span>
                                <?php echo t("My Karma"); ?>
                            </span>
                        </div>

                        <div class="card-text">
                            <div class="karma-totals">
                                <?php $totalSum = 0; ?>

                                <?php foreach ($myTotalList as $actionName => $totalPoints) { ?>
                                    <p>
                                        <span>
                                            <?php echo $actionName; ?>
                                        </span>

                                        <strong class="float-right">
                                            <?php echo number_format($totalPoints); ?>
                                        </strong>

                                        <?php $totalSum += $totalPoints; ?>
                                    </p>
                                <?php } ?>

                                <?php if ($totalSum === 0) { ?>
                                    <p>
                                        <?php echo t("You don't have earned any karma yet."); ?>
                                    </p>
                                <?php } else { ?>
                                    <p>
                                    <span>
                                        <?php echo t("Total:"); ?>
                                    </span>

                                        <strong class="float-right">
                                            <?php echo number_format($totalSum); ?>
                                        </strong>
                                    </p>
                                <?php } ?>
                            </div>

                            <div class="clearfix"></div>

                            <hr>

                            <div class="karma-request">
                                <strong>
                                    <?php echo t("Karma Request"); ?>
                                </strong>

                                <p>
                                    <?php echo t("Karma Have you done something that you think you should get karma for? Tell us!"); ?>
                                </p>

                                <div class="text-center">
                                    <a href="javascript:void(0);" class="btn btn-primary" onclick="alert('What should happening when click on this button?');">
                                        <?php echo t("Submit Karma Request"); ?>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
