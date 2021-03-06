package cz.muni.fi.pv243.model;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OrderBy;
import javax.validation.constraints.Min;
import javax.xml.bind.annotation.XmlRootElement;

import com.fasterxml.jackson.annotation.JsonView;

@Entity
@XmlRootElement
public class Volume implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", updatable = false, nullable = false)
    private Long id;

    @Column(nullable = false, unique = true)
    @Min(1)
    private long barcodeId;

    @ManyToOne
    @JsonView({ Volume.class, User.class })
    private Book book;

    @OneToMany(mappedBy = "volume", cascade = CascadeType.ALL)
    @JsonView(Volume.class)
    @OrderBy("loanDate")
    private List<Loan> loans = new ArrayList<>();

    @JsonView({ Volume.class, Book.class })
    public boolean isLent() {
        for (Loan loan : loans) {
            if (loan.getReturnDate() == null)
                return true;
        }
        return false;
    }

    public Book getBook() {
        return book;
    }

    public List<Loan> getLoans() {
        return loans;
    }

    public void setLoans(List<Loan> loans) {
        this.loans = loans;
    }

    public void setBook(Book book) {
        this.book = book;
    }

    public Long getId() {
        return this.id;
    }

    public void setId(final Long id) {
        this.id = id;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (!(obj instanceof Volume)) {
            return false;
        }
        Volume other = (Volume) obj;
        if (id != null) {
            if (!id.equals(other.id)) {
                return false;
            }
        }
        return true;
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((id == null) ? 0 : id.hashCode());
        return result;
    }

    public long getBarcodeId() {
        return barcodeId;
    }

    public void setBarcodeId(long barcodeId) {
        this.barcodeId = barcodeId;
    }

    @Override
    public String toString() {
        String result = getClass().getSimpleName() + " ";
        result += "barcodeId: " + barcodeId;
        return result;
    }
}