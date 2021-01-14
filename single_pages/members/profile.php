<?php

/**
 * @project:   ConcreteCMS Theme
 *
 * @copyright  (C) 2021 Portland Labs (https://www.portlandlabs.com)
 * @author     Fabian Bitter (fabian@bitter.de)
 */

defined('C5_EXECUTE') or die("Access Denied.");

use Concrete\Core\Attribute\Category\UserCategory;
use Concrete\Core\Entity\File\File;
use Concrete\Core\Entity\File\Version;
use Concrete\Core\Localization\Service\Date;
use Concrete\Core\Page\Page;
use Concrete\Core\Support\Facade\Application;
use Concrete\Core\Support\Facade\Url;
use Concrete\Core\User\Group\Group;
use Concrete\Core\User\Point\Entry;
use Concrete\Core\User\PrivateMessage\Mailbox as UserPrivateMessageMailbox;
use Concrete\Core\User\User;
use Concrete\Core\User\UserInfo;
use Concrete\Core\View\View;
use Concrete\Core\Config\Repository\Repository;

/** @var Group[] $badges */
/** @var View $view */
/** @var bool $canEdit */
/** @var UserInfo $profile */

$app = Application::getFacadeApplication();
/** @var  Date $dateHelper */
$dateHelper = $app->make(Date::class);
/** @var UserCategory $userCategory */
$userCategory = $app->make(UserCategory::class);
/** @var Repository $config */
$config = $app->make(Repository::class);

$earnBadgesPageId = (int)$config->get("concrete_cms_theme.earn_badges_page_id");
$earnBadgesPage = Page::getByID($earnBadgesPageId);

$user = new User();

$mailbox = UserPrivateMessageMailbox::get($profile, UserPrivateMessageMailbox::MBTYPE_INBOX);
$totalMessages = 0;

if ($mailbox instanceof UserPrivateMessageMailbox) {
    $messageList = $mailbox->getMessageList();
    $totalMessages = $messageList->getTotal();
}

$isOwnProfile = $profile->getUserID() == $user->getUserID();

?>

<div class="public-profile">
    <div class="profile-header-image">
        <?php
        $headerImage = $profile->getAttribute("header_image");
        if ($headerImage instanceof File) {
            $fileVersion = $headerImage->getApprovedVersion();
            if ($fileVersion instanceof Version) {
                echo '<img src="' . $fileVersion->getURL() . '" alt="' . h(t("Header Image of %s", $profile->getUserName())) . '">';
            }
        }
        ?>
    </div>

    <div class="container">
        <div class="row">
            <div class="col">
                <div class="profile-meta">
                    <div class="profile-image">
                        <div class="image-wrapper">
                            <?php echo $profile->getUserAvatar()->output(); ?>
                        </div>
                    </div>

                    <div class="profile-intro">
                        <?php /** @noinspection PhpUnhandledExceptionInspection */
                        echo t(
                            '%s has posted %s, been awarded %s and has accumulated %s since joining concretecms.org on %s.',
                            $profile->getUserName(),
                            "<strong>" . t2("%s message", "%s messages", $totalMessages, number_format($totalMessages)) . "</strong>",
                            "<strong>" . t2("%s badge", "%s badges", count($badges), number_format(count($badges))) . "</strong>",
                            "<strong>" . t2("%s karma point", "%s karma points", (int)Entry::getTotal($profile), number_format((int)Entry::getTotal($profile))) . "</strong>",
                            $dateHelper->formatDate($profile->getUserDateAdded(), true)
                        ); ?>
                    </div>

                    <div class="profile-username">
                        <h1>
                            <?php
                            $userDisplayName = (string)$profile->getAttribute('first_name') . " " . (string)$profile->getAttribute('last_name');
                            if (strlen(trim($userDisplayName)) === 0) {
                                $userDisplayName = $profile->getUserName();
                            }
                            echo $userDisplayName;
                            ?>
                        </h1>

                        <div class="profile-user-actions">
                            <div class="float-right">
                                <a href="<?php echo (string)Url::to("account/messages"); ?>" class="btn btn-secondary">
                                    <?php echo t("Inbox"); ?>
                                </a>

                                <?php if (!$isOwnProfile) { ?>
                                    <a href="javascript:void(0);" class="btn btn-primary send-message"
                                       data-receiver="<?php echo h($profile->getUserID()); ?>">
                                        <?php echo t("Send Message"); ?>
                                    </a>
                                <?php } ?>
                            </div>
                        </div>
                    </div>

                    <div class="clearfix"></div>

                    <div class="profile-description">
                        <?php if (strlen($profile->getAttribute('description')) === 0) { ?>
                            <?php echo t("No bio information entered."); ?>
                        <?php } else { ?>
                            <?php echo nl2br($profile->getAttribute('description')); ?>
                        <?php } ?>

                        <?php if ($profile->getAttribute('website') != "") { ?>
                            <div class="profile-website">
                                <a href="<?php echo h((string)$profile->getAttribute('website')) ?>">
                                    <?php
                                    $urlParts = parse_url((string)$profile->getAttribute('website'));
                                    echo $urlParts["host"];
                                    ?>
                                </a>
                            </div>
                        <?php } ?>
                    </div>

                    <div class="profile-user-actions">
                        <a href="<?php echo (string)Url::to("account/messages"); ?>" class="btn btn-secondary">
                            <?php echo t("Inbox"); ?>
                        </a>

                        <?php if (!$isOwnProfile) { ?>
                            <a href="javascript:void(0);" class="btn btn-primary send-message"
                               data-receiver="<?php echo h($profile->getUserID()); ?>">
                                <?php echo t("Send Message"); ?>
                            </a>
                        <?php } ?>
                    </div>
                </div>

                <div class="clearfix"></div>

                <div class="card">
                    <div class="card-body">
                        <div class="card-title">
                            <span>
                                <?php echo t("Information"); ?>
                            </span>

                            <a href="<?php echo (string)Url::to('/account/edit_profile') ?>"
                               class="btn btn-sm btn-secondary float-right">
                                <?php echo t("Edit Profile"); ?>
                            </a>
                        </div>

                        <div class="card-text">
                            <div class="row">
                                <div class="col-md">
                                    <?php $this->inc('elements/members/user_attribute.php', [
                                        "title" => t("Past Experience"),
                                        "attribute" => $profile->getAttribute('past_experience')
                                    ]); ?>
                                </div>

                                <div class="col-md">
                                    <?php $this->inc('elements/members/user_attribute.php', [
                                        "title" => t("Associations"),
                                        "attribute" => $profile->getAttribute('associations')
                                    ]); ?>
                                </div>

                                <div class="col-md">
                                    <?php $this->inc('elements/members/user_attribute.php', [
                                        "title" => t("Contact"),
                                        "attribute" => $profile->getAttribute('address')
                                    ]); ?>
                                    <?php if ($profile->getAttribute('phone') != "") { ?>
                                        <a href="tel:<?php echo h((string)$profile->getAttribute('phone')) ?>">
                                            <?php echo (string)$profile->getAttribute('phone') ?>
                                        </a>
                                    <?php } ?>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-md">
                                    <?php $this->inc('elements/members/user_attribute.php', [
                                        "title" => t("Current Specialies"),
                                        "attribute" => $profile->getAttribute('current_specialties')
                                    ]); ?>
                                </div>

                                <div class="col-md">
                                    <?php $this->inc('elements/members/user_attribute.php', [
                                        "title" => t("Education"),
                                        "attribute" => $profile->getAttribute('education')
                                    ]); ?>
                                </div>

                                <div class="col-md">

                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <?php if (count($badges) > 0) { ?>
                    <div class="card">
                        <div class="card-body">
                            <div class="card-title">
                            <span>
                                <?php echo t("Badges"); ?>
                            </span>

                                <?php if ($earnBadgesPage instanceof Page && !$earnBadgesPage->isError()) { ?>
                                    <a href="<?php echo (string)Url::to($earnBadgesPage) ?>"
                                       class="btn btn-sm btn-secondary float-right">
                                        <?php echo t("Earn Badges"); ?>
                                    </a>
                                <?php } ?>
                            </div>
                        </div>

                        <div class="card-text">
                            <div class="row">
                                <div class="col">
                                    <div class="profile-badges">
                                        <?php foreach ($badges as $ub) { ?>
                                            <?php /** @var File $uf */
                                            $uf = $ub->getGroupBadgeImageObject(); ?>

                                            <?php if (is_object($uf)) { ?>
                                                <div class="profile-badge">
                                                    <img src="<?php echo $uf->getApprovedVersion()->getRelativePath() ?>"
                                                         alt="<?php echo h($ub->getGroupBadgeDescription()) ?>"/>
                                                </div>
                                            <?php } ?>
                                        <?php } ?>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                <?php } ?>
            </div>
        </div>
    </div>
</div>