<?php

defined('C5_EXECUTE') or die('Access Denied.');

/**
 * @var $navigation \Concrete\Core\Navigation\Navigation
 */
$items = $navigation->getItems();

?>

<div class="row">

    <?php
    foreach($items as $item) { ?>

        <div class="col-md">
            <div class="footer-navigation">
                <div class="d-none d-md-block">
                    <ul class="list-unstyled">
                        <h4 class="page-title">
                            <?=$item->getName()?>
                        </h4>

                        <?php
                        foreach($item->getChildren() as $child) { ?>

                        <li>
                            <a href="<?=$child->getUrl()?>"
                               target="_self">
                                <?=h($child->getName())?>
                            </a>
                        </li>

                        <?php } ?>
                    </ul>
                </div>
            </div>
        </div>

    <?php } ?>





</div>