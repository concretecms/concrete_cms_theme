<?php

/**
 * @project:   Concrete CMS Theme
 *
 * @copyright  (C) 2021 Portland Labs (https://www.portlandlabs.com)
 * @author     Fabian Bitter (fabian@bitter.de)
 */

defined('C5_EXECUTE') or die('Access denied');

use Concrete\Core\Entity\File\File;

/** @var File $image */
/** @var string $title */
/** @var string $description */

?>

<div class="ccm-feature-item">
    <div class="ccm-feature-image-wrapper">
        <img src="<?php echo h($image->getApprovedVersion()->getURL()); ?>" alt="<?php echo h($title); ?>"
             class="ccm-feature-image"/>
    </div>

    <div class="ccm-feature-content">
        <h2 class="ccm-feature-title">
            <?php echo $title; ?>
        </h2>

        <div class="ccm-feature-description">
            <?php echo $description; ?>
        </div>
    </div>
</div>
