<?php

/**
 * @project:   Concrete CMS Theme
 *
 * @copyright  (C) 2021 Portland Labs (https://www.portlandlabs.com)
 * @author     Fabian Bitter (fabian@bitter.de)
 */

defined('C5_EXECUTE') or die('Access denied');

use Concrete\Core\Entity\File\File;
use Concrete\Core\Entity\File\Version;
use Concrete\Core\Entity\Package;
use Concrete\Core\Package\PackageService;
use Concrete\Core\Support\Facade\Application;
use Concrete\Package\ConcreteCmsTheme\Controller;

/** @var string $quote */
/** @var string $name */
/** @var File $image */
/** @var string $background */
/** @var string $alignment */

$app = Application::getFacadeApplication();
/** @var PackageService $packageService */
$packageService = $app->make(PackageService::class);
/** @var Package $pkgEntity */
$pkgEntity = $packageService->getByHandle("concrete_cms_theme");
/** @var Controller $pkg */
$pkg = $pkgEntity->getController();

$defaultImageUrl = $pkg->getRelativePath() . "/images/default_thumbnail_small.jpg";
?>

<div class="image-with-quote <?php echo h($alignment); ?> <?php echo h($background); ?>">
    <div class="container">
        <div class="row">
            <div class="image">
                <?php
                $imageUrl = null;

                if ($image instanceof File) {
                    $imageApprovedVersion = $image->getApprovedVersion();

                    if ($imageApprovedVersion instanceof Version) {
                        $imageUrl = $imageApprovedVersion->getURL();
                    }
                }
                ?>

                <img src="<?php echo $imageUrl ?? $defaultImageUrl; ?>" alt="<?php echo h($name); ?>"/>
            </div>

            <div class="content my-auto">
                <div class="text">
                    <div class="quote">
                        <?php echo $quote; ?>
                    </div>

                    <div class="name">
                        <?php echo $name; ?>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
