<?php

/**
 * @project:   ConcreteCMS Theme
 *
 * @copyright  (C) 2021 Portland Labs (https://www.portlandlabs.com)
 * @author     Fabian Bitter (fabian@bitter.de)
 */

use Concrete\Core\Form\Service\Form;
use Concrete\Core\Http\Request;
use Concrete\Core\Page\Page;
use Concrete\Core\Search\Pagination\Pagination;
use Concrete\Core\Support\Facade\Application;
use Concrete\Core\Utility\Service\Text;
use Concrete\Core\View\View;

defined('C5_EXECUTE') or die('Access Denied.');

/** @var bool $do_search */
/** @var Pagination $pagination */
/** @var Page[] $results */
/** @var bool $searchAll */
/** @var bool $allowUserOptions */
/** @var string $query */
/** @var string $baseSearchPath */
/** @var string $resultTarget */
/** @var $view View */
$app = Application::getFacadeApplication();
/** @var Text $tt */
$tt = $app->make(Text::class);
/** @var Form $form */
$form = $app->make(Form::class);
/** @var Request $request */
$request = $app->make(Request::class);
//
?>

<?php if (isset($error)) { ?>
    <?php echo $error ?>
    <br/><br/>
<?php } ?>

<?php if (!isset($query) || !is_string($query)) {
    $query = '';
}

?>

<form action="<?php /** @noinspection PhpDeprecationInspection */
echo $view->url($resultTarget) ?>" method="get" class="ccm-search-block-form">
    <div class="ccm-search-header">
        <?php if (isset($title) && ($title !== '')) { ?>
            <h3 class="page-title">
                <?php echo h($title) ?>
            </h3>
        <?php } ?>

        <?php if ($query === '') { ?>
            <?php echo $form->hidden("search_paths[]", $baseSearchPath); ?>
        <?php } elseif ($request->query->has("search_paths") && is_array($request->query->get("search_paths"))) { ?>
            <?php foreach ($request->query->get("search_paths") as $search_path) { ?>
                <?php if (is_string($search_path)) { ?>
                    <?php echo $form->hidden("search_paths[]", htmlentities($search_path, ENT_COMPAT, APP_CHARSET)); ?>
                <?php } ?>
            <?php } ?>
        <?php } ?>

        <div class="ccm-search-input">
            <div class="input-group">
                <?php echo $form->text("query", htmlentities($query, ENT_COMPAT, APP_CHARSET), ["class" => "ccm-search-block-text form-control", "placeholder" => t("Enter your search term here...")]); ?>

                <div class="input-group-append">
                    <button type="submit">
                        <i class="fas fa-search"></i>
                    </button>
                </div>
            </div>
        </div>
    </div>
    <div class="ccm-search-content">
        <?php if (isset($do_search) && $do_search) {
            if (count($results) == 0) { ?>
                <p>
                    <?php echo t('There were no results found. Please try another keyword or phrase.') ?>
                </p>
            <?php } else { ?>
                <div id="searchResults">
                    <?php foreach ($results as $r) { ?>
                        <?php
                        $currentPageBody = $tt->shortText($r->getPageIndexContent());
                        if (strlen($currentPageBody) === 0) {
                            $currentPageBody = t("No description available.");
                        }
                        ?>

                        <div class="searchResult">
                            <h3>
                                <a href="<?php echo $r->getCollectionLink() ?>">
                                    <?php echo $r->getCollectionName() ?>
                                </a>
                            </h3>

                            <a href="<?php echo $r->getCollectionLink() ?>" class="pageLink">
                                <?php echo $r->getCollectionLink() ?>
                            </a>

                            <p>
                                <?php if ($r->getCollectionDescription()) { ?>
                                    <?php echo $tt->shortText($r->getCollectionDescription()); ?>
                                    <br/>
                                <?php } ?>

                                <?php echo $currentPageBody; ?>
                            </p>
                        </div>
                    <?php } ?>
                </div>

                <div class="pagination-container">
                    <?php
                    $pages = $pagination->getCurrentPageResults();
                    if ($pagination->haveToPaginate()) {
                        $showPagination = true;
                        echo $pagination->renderView('application');
                    }
                    ?>
                </div>
            <?php } ?>
        <?php } ?>
    </div>
</form>
