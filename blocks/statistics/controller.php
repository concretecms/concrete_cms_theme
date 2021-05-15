<?php /** @noinspection SqlDialectInspection */
/** @noinspection SqlNoDataSourceInspection */
/** @noinspection PhpInconsistentReturnPointsInspection */

/**
 * @project:   Concrete CMS Theme
 *
 * @copyright  (C) 2021 Portland Labs (https://www.portlandlabs.com)
 * @author     Fabian Bitter (fabian@bitter.de)
 */

namespace Concrete\Package\ConcreteCmsTheme\Block\Statistics;

use Concrete\Core\Block\BlockController;
use Concrete\Core\Database\Connection\Connection;

class Controller extends BlockController
{
    protected $btTable = "btStatistics";
    protected $btIgnorePageThemeGridFrameworkContainer = true;

    public function getBlockTypeDescription()
    {
        return t('Integrate statistics to your site.');
    }

    public function getBlockTypeName()
    {
        return t('Statistics');
    }

    public function duplicate($newBID)
    {
        parent::duplicate($newBID);
        /** @var Connection $db */
        $db = $this->app->make(Connection::class);
        $copyFields = 'label, value';
        /** @noinspection PhpUnhandledExceptionInspection */
        $db->executeUpdate(
            "INSERT INTO btStatisticsEntries (bID, {$copyFields}) SELECT ?, {$copyFields} FROM btStatisticsEntries WHERE bID = ?",
            [
                $newBID,
                $this->bID
            ]
        );
    }

    public function delete()
    {
        /** @var Connection $db */
        $db = $this->app->make(Connection::class);
        /** @noinspection PhpUnhandledExceptionInspection */
        $db->delete('btStatisticsEntries', ['bID' => $this->bID]);
        parent::delete();
    }


    public function save($args)
    {
        /** @var Connection $db */
        $db = $this->app->make(Connection::class);
        /** @noinspection PhpUnhandledExceptionInspection */
        $db->executeQuery('DELETE from btStatisticsEntries WHERE bID = ?', [$this->bID]);

        parent::save($args);

        if (isset($args["entries"])) {
            foreach ($args["entries"] as $args) {
                /** @noinspection PhpUnhandledExceptionInspection */
                $db->executeQuery('INSERT INTO btStatisticsEntries (bID, label, value) values(?, ?, ?)',
                    [
                        $this->bID,
                        $args['label'],
                        $args['value']
                    ]
                );
            }
        }
    }

    public function validate($args)
    {
        $e = parent::validate($args);

        if (is_array($args["entries"]) && count($args["entries"]) > 0) {

            if (count($args["entries"]) > 3) {
                $e->add(t("You can't add more then three entries."));
            } else {
                foreach ($args["entries"] as $entry) {
                    if (!isset($entry["label"]) || strlen($entry["label"]) === 0) {
                        $e->add(t("You need to enter a label."));
                    }

                    if (!isset($entry["value"]) || strlen($entry["value"]) === 0) {
                        $e->add(t("You need to enter a value."));
                    }
                }
            }
        } else {
            $e->add(t("You need to add at least one entry."));
        }

        return $e;
    }

    public function add()
    {
        $this->set('entries', []);
    }

    public function edit()
    {
        /** @var Connection $db */
        $db = $this->app->make(Connection::class);
        $entries = $db->fetchAll('SELECT * from btStatisticsEntries WHERE bID = ?', [$this->bID]);
        $this->set('entries', $entries);
    }

    public function view()
    {
        /** @var Connection $db */
        $db = $this->app->make(Connection::class);
        $entries = $db->fetchAll('SELECT * from btStatisticsEntries WHERE bID = ?', [$this->bID]);
        $this->set('entries', $entries);
    }
}
