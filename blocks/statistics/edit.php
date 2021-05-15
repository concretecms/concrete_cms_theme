<?php

/**
 * @project:   Concrete CMS Theme
 *
 * @copyright  (C) 2021 Portland Labs (https://www.portlandlabs.com)
 * @author     Fabian Bitter (fabian@bitter.de)
 */

defined('C5_EXECUTE') or die('Access denied');

use Concrete\Core\Form\Service\Form;
use Concrete\Core\Support\Facade\Application;

/** @var string $title */
/** @var array $entries */

$app = Application::getFacadeApplication();
/** @var Form $form */
$form = $app->make(Form::class);

?>

<fieldset>
    <legend>
        <?php echo t("General"); ?>
    </legend>

    <div class="form-group">
        <?php echo $form->label("title", t('Title')); ?>
        <?php echo $form->text("title", $title) ?>
    </div>
</fieldset>

<fieldset>
    <legend>
        <?php echo t("Entries"); ?>
    </legend>

    <div id="ccm-entry-container"></div>

    <a href="javascript:void(0);" id="ccm-add-entry" class="btn btn-primary">
        <?php echo t("Add Entry"); ?>
    </a>
</fieldset>

<style type="text/css">
    .ccm-entry {
        background-color: #f5f5f5;
        padding: 20px;
        display: block;
        margin-bottom: 15px;
    }

    .ccm-entry .form-group {
        padding-left: 0;
    }
</style>

<script id="ccm-entry-template" type="text/template">
    <div class="ccm-entry" data-entry-id="<%=entry.id%>">
        <div class="form-group">
            <label for="ccm-entry-<%=entry.id%>-value">
                <?php echo t("Value"); ?>
            </label>

            <input type="text"
                   value="<%=entry.value%>"
                   name="entries[<%=entry.id%>][value]"
                   id="ccm-entry-<%=entry.id%>-value"
                   class="form-control"/>
        </div>

        <div class="form-group">
            <label for="ccm-entry-<%=entry.id%>-label">
                <?php echo t("Label"); ?>
            </label>

            <input type="text"
                   value="<%=entry.label%>"
                   name="entries[<%=entry.id%>][label]"
                   id="ccm-entry-<%=entry.id%>-label"
                   class="form-control"/>
        </div>

        <a href="javascript:void(0);"
           class="ccm-remote-entry btn btn-secondary"
           data-entry-id="<%=entry.id%>">
            <?php echo t("Remote Entry"); ?>
        </a>
    </div>
</script>

<script type="text/javascript">
    (function ($) {
        $(function () {
            var latestEntryId = 0;

            var removeEntry = function (id) {
                $(".ccm-entry[data-entry-id='" + id + "']").remove();
            };

            var addEntry = function (entry) {
                latestEntryId++;

                entry = entry || {};

                entry.id = latestEntryId;
                entry.label = entry.label || '';
                entry.value = entry.value || '';

                $("#ccm-entry-container").append(
                    _.template($("#ccm-entry-template").html())({
                        entry: entry
                    })
                );

                $("#ccm-entry-container a[data-entry-id='" + latestEntryId + "']").click(function (e) {
                    e.preventDefault();

                    removeEntry($(this).data("entryId"));

                    return false;
                });
            };

            var addEntries = function (entries) {
                for (var entry of entries) {
                    addEntry(entry);
                }
            };

            $("#ccm-add-entry").click(function (e) {
                e.preventDefault();

                addEntry({
                    label: '',
                    value: ''
                });

                return false;
            });

            addEntries(<?php /** @noinspection PhpComposerExtensionStubsInspection */echo json_encode($entries);?>)
        });
    })(jQuery);
</script>