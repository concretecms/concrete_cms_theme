<?php

/**
 * @project:   ConcreteCMS Marketing
 *
 * @copyright  (C) 2021 Portland Labs (https://www.portlandlabs.com)
 * @author     Fabian Bitter (fabian@bitter.de)
 */

defined('C5_EXECUTE') or die("Access Denied.");

use Concrete\Core\Entity\File\File;
use Concrete\Core\Entity\File\Version;
use Concrete\Core\Entity\Package;
use Concrete\Core\Package\PackageService;
use Concrete\Core\Support\Facade\Application;
use Concrete\Package\ConcreteCmsTheme\Controller;

/** @var File|null $thumbnail */
/** @var string $link */
/** @var string $title */
/** @var string $description */

$app = Application::getFacadeApplication();
/** @var PackageService $packageService */
$packageService = $app->make(PackageService::class);
/** @var Package $pkgEntity */
$pkgEntity = $packageService->getByHandle("concrete_cms_theme");
/** @var Controller $pkg */
$pkg = $pkgEntity->getController();

$defaultThumbnailUrl = $pkg->getRelativePath() . "/images/default_thumbnail_small.jpg";

if (isset($thumbnail)) {
    $thumbnail = \Concrete\Core\File\File::getByID($thumbnail->jsonSerialize()["fID"]);
} else {
    $thumbnail = null;
}
?>

<a href="<?php echo (string)$link; ?>" class="case-study-item-wrapper-link">
    <div class="case-study-item">
        <?php
        $thumbnailUrl = null;

        if ($thumbnail instanceof File) {
            $thumbnailApprovedVersion = $thumbnail->getApprovedVersion();

            if ($thumbnailApprovedVersion instanceof Version) {
                $thumbnailUrl = $thumbnailApprovedVersion->getThumbnailURL("case_study_thumbnail");
            }
        }
        ?>

        <span class="thumbnail">
            <img src="<?php echo $thumbnailUrl ?? $defaultThumbnailUrl; ?>"
                 alt="<?php echo h($title); ?>">
        </span>

        <h3 class="title">
            <?php echo $title; ?>
        </h3>

        <p class="description">
            <?php echo $description ?? t("No Description available"); ?>
        </p>

        <div class="clearfix"></div>
    </div>
</a>