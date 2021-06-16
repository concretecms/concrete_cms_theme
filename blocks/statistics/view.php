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
    <hr>
    <div class="container">
        <div class="row">
            <div class="col-12">
                <h2 class="ccm-statistics-title">
                    <?php echo $title; ?>
                </h2>
            </div>
        </div>

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
                        <div class="value">
                            <?php echo $entry["value"]; ?>
                        </div>

                        <div class="label">
                            <?php echo $entry["label"]; ?>
                        </div>
                    </div>
                </div>
            <?php } ?>
        </div>
    </div>
    <hr>
</div>