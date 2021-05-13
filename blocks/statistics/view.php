<?php

/**
 * @project:   Concrete CMS Theme
 *
 * @copyright  (C) 2021 Portland Labs (https://www.portlandlabs.com)
 * @author     Fabian Bitter (fabian@bitter.de)
 */

defined('C5_EXECUTE') or die('Access denied');

/** @var string $title */
/** @var array $entries */

?>

<div class="ccm-statistics-container">
    <div class="container">
        <?php if (strlen($title) > 0) { ?>
            <div class="row">
                <div class="col-12">
                    <h2 class="ccm-statistics-title">
                        <?php echo $title; ?>
                    </h2>
                </div>
            </div>
        <?php } ?>

        <div class="row">
            <?php
            $columnClass = 'col-md-12';

            if (count($entries) === 2) {
                $columnClass = 'col-md-6';
            } else if (count($entries) === 3) {
                $columnClass = 'col-md-4';
            }
            ?>
            <?php foreach ($entries as $entry) { ?>
                <div class="<?php echo $columnClass; ?>">
                    <div class="ccm-statistics-item">
                        <h3 class="value">
                            <?php echo $entry["value"]; ?>
                        </h3>

                        <p class="label">
                            <?php echo $entry["label"]; ?>
                        </p>
                    </div>
                </div>
            <?php } ?>
        </div>
    </div>
</div>