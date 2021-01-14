<?php

/**
 * @project:   ConcreteCMS Theme
 *
 * @copyright  (C) 2021 Portland Labs (https://www.portlandlabs.com)
 * @author     Fabian Bitter (fabian@bitter.de)
 */

defined('C5_EXECUTE') or die("Access Denied.");

/** @var string $image */
/** @var string $name */
/** @var string $position */
/** @var string $paragraph */
?>

<div class="ccm-block-testimonial-wrapper">
    <div class="ccm-block-testimonial">
        <?php if ($image): ?>
            <div class="ccm-block-testimonial-image"><?php echo $image ?></div>
        <?php endif; ?>

        <div class="ccm-block-testimonial-text">

            <?php if ($paragraph): ?>
                <div class="ccm-block-testimonial-paragraph"><?php echo h($paragraph) ?></div>
            <?php endif; ?>

            <div class="ccm-block-testimonial-name">
                <?php echo h($name) ?>

                <span class="ccm-block-testimonial-position">
                    <?php echo h($position) ?>
                </span>
            </div>
        </div>

    </div>
</div>