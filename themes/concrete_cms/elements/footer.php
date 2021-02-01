<?php

/**
 * @project:   ConcreteCMS Theme
 *
 * @copyright  (C) 2021 Portland Labs (https://www.portlandlabs.com)
 * @author     Fabian Bitter (fabian@bitter.de)
 */

defined('C5_EXECUTE') or die("Access Denied.");

use Concrete\Core\Area\GlobalArea;
use Concrete\Core\View\View;
use Concrete\Core\Support\Facade\Url;
use Concrete\Core\Support\Facade\Application;
use Concrete\Core\Config\Repository\Repository;

/** @var View $view */

$app = Application::getFacadeApplication();
/** @var Repository $config */
$config = $app->make(Repository::class);

?>
<footer>
    <div class="container">
        <?php if ($config->get("concrete_cms_theme.use_static_navigation")) { ?>
            <?php /** @noinspection PhpUnhandledExceptionInspection */
            echo View::element("footer_navigation", [], "concrete_cms_theme"); ?>
        <?php } else { ?>
            <div class="row">
                <div class="col-md">
                    <div class="footer-navigation">
                        <?php
                        $a = new GlobalArea('Footer Navigation Column 1');
                        $a->display($c);
                        ?>
                    </div>
                </div>

                <div class="col-md">
                    <div class="footer-navigation">
                        <?php
                        $a = new GlobalArea('Footer Navigation Column 2');
                        $a->display($c);
                        ?>
                    </div>
                </div>

                <div class="col-md">
                    <div class="footer-navigation">
                        <?php
                        $a = new GlobalArea('Footer Navigation Column 3');
                        $a->display($c);
                        ?>
                    </div>
                </div>

                <div class="col-md">
                    <div class="footer-navigation">
                        <?php
                        $a = new GlobalArea('Footer Navigation Column 4');
                        $a->display($c);
                        ?>
                    </div>
                </div>

                <div class="col-md">
                    <div class="footer-navigation">
                        <?php
                        $a = new GlobalArea('Footer Navigation Column 5');
                        $a->display($c);
                        ?>
                    </div>
                </div>
            </div>
        <?php } ?>

        <div class="row">
            <div class="col-sm">
                <div class="footer-site-title">
                    <?php
                    $a = new GlobalArea('Footer Site Title');
                    $a->display($c);
                    ?>
                </div>
            </div>

            <div class="col-sm">
                <div class="footer-language-switcher">
                    <?php
                    $a = new GlobalArea('Footer Language Switcher');
                    $a->display($c);
                    ?>
                </div>
            </div>

            <div class="col-sm">
                <div class="float-right">
                    <div class="footer-social">
                        <?php
                        $a = new GlobalArea('Footer Social');
                        $a->display($c);
                        ?>
                    </div>
                </div>
            </div>

            <div class="col-sm">
                <div class="footer-legal">
                    <?php
                    $a = new GlobalArea('Footer Legal');
                    $a->display($c);
                    ?>
                </div>
            </div>
        </div>
    </div>
</footer>
</div>
<?php
/** @noinspection PhpUnhandledExceptionInspection */
View::element('footer_required');
?>
<script src="<?php echo (string)Url::to("/community/js"); ?>"></script>
<!--suppress HtmlUnknownTarget -->
<script type="text/javascript" src="<?php echo $view->getThemePath() ?>/js/main.js"></script>
</body>
</html>
