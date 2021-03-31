<?php

/**
 * @project:   ConcreteCMS Theme
 *
 * @copyright  (C) 2021 Portland Labs (https://www.portlandlabs.com)
 * @author     Fabian Bitter (fabian@bitter.de)
 */

defined('C5_EXECUTE') or die("Access Denied.");

use Concrete\Core\Area\GlobalArea;
use Concrete\Core\Page\Page;
use Concrete\Core\View\View;
use Concrete\Core\Support\Facade\Url;
use Concrete\Core\Support\Facade\Application;
use Concrete\Core\Config\Repository\Repository;

/** @var View $view */

$app = Application::getFacadeApplication();
/** @var Repository $config */
$config = Site::getSite()->getConfigRepository();

$enableDarkMode = $config->get("concrete_cms_theme.enable_dark_mode") || ($c instanceof Page? $c->getAttribute("enable_dark_mode") : false);
?>
<footer>
    <div class="container">

        <?php

        $element = Element::get('footer_navigation', 'concrete_cms_theme');
        $element->render();

        ?>
        <div class="row">
            <div class="col-sm">
                <div class="footer-site-title">
                    <?php
                    $a = new GlobalArea('Footer Site Title' . ($enableDarkMode ? " (Dark Mode)" : ""));
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
