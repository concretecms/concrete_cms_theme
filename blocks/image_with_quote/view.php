<?php

/**
 * @project:   Concrete CMS Theme
 *
 * @copyright  (C) 2021 Portland Labs (https://www.portlandlabs.com)
 * @author     Fabian Bitter (fabian@bitter.de)
 */

defined('C5_EXECUTE') or die('Access denied');

use Concrete\Core\Entity\File\File;

/** @var string $quote */
/** @var string $name */
/** @var File $image */
/** @var string $background */
/** @var string $alignment */

?>

<div class="image-with-quote <?php echo h($alignment); ?> <?php echo h($background); ?>">
    <div class="container">
        <div class="image">
            <img src="<?php echo $image->getApprovedVersion()->getURL(); ?>" alt="<?php echo h($name); ?>"/>
        </div>

        <div class="content">
            <div class="quote">
                <?php echo $quote; ?>
            </div>

            <div class="name">
                <?php echo $name; ?>
            </div>
        </div>
    </div>
</div>